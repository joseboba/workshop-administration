import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ClienteService } from '../cliente/cliente.service';
import { MecanicoService } from '../mecanico/mecanico.service';
import * as bcrypt from 'bcrypt';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { PaginationResponseDto } from '../../commons';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';
import { UsuarioPaginationFiltersDto } from './dto/usuario-pagination-filters.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly clienteService: ClienteService,
    private readonly mecanicoService: MecanicoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    let queryRunner: QueryRunner;
    let response: Usuario;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = Usuario.fromCreateDto(createUsuarioDto);
      entity.mecanico = null;
      entity.cliente = null;

      if (!createUsuarioDto.cliCodigo && !createUsuarioDto.mecCodigo) {
        throw new BadRequestException('Debe seleccionar un tipo de usuario');
      }

      if (createUsuarioDto.cliCodigo && createUsuarioDto.mecCodigo) {
        throw new BadRequestException(
          'El usuario únicamente puede ser cliente o mecanico',
        );
      }

      if (createUsuarioDto.usrAdministrador && createUsuarioDto.cliCodigo) {
        throw new BadRequestException(
          'Un cliente no puede ser usuario administrador',
        );
      }

      if (createUsuarioDto.mecCodigo) {
        await this.findUsuarioByMecanico(createUsuarioDto.mecCodigo);
        entity.mecanico = await this.mecanicoService.findOne(
          createUsuarioDto.mecCodigo,
        );
      }
      if (createUsuarioDto.cliCodigo) {
        await this.findUsuarioByCliente(createUsuarioDto.cliCodigo);
        entity.cliente = await this.clienteService.findOne(
          createUsuarioDto.cliCodigo,
        );
      }
      const salt = await bcrypt.genSalt();
      entity.usrContrasenia = await bcrypt.hash(
        createUsuarioDto.usrContrasenia,
        salt,
      );
      response = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    delete response.usrContrasenia;
    return response;
  }

  async findAll(usuarioPaginationFiltersDto: UsuarioPaginationFiltersDto) {
    const {
      size = 10,
      page = 0,
      sort = 'usr.usrCodigo,asc',
      clienteNombre = '',
      clienteDpi = '',
      mecanicoNombre = '',
      mecanicoDpi = '',
    } = usuarioPaginationFiltersDto;

    const splitSortValues = sort ? sort.split(',') : [];
    const skip = page * size;
    const parameters = {
      clienteNombre: convertToLikeParameter(clienteNombre),
      clienteDpi: convertToLikeParameter(clienteDpi),
      mecanicoNombre: convertToLikeParameter(mecanicoNombre),
      mecanicoDpi: convertToLikeParameter(mecanicoDpi),
    };

    const filters = `
      (:clienteNombre = '' or lower(cli.cli_nombres) like :clienteNombre) and
      (:clienteDpi = '' or lower(cli.cli_dpi) like :clienteDpi) and
      (:mecanicoNombre = '' or lower(mec.mec_nombres) like :mecanicoNombre) and
      (:mecanicoDpi = '' or lower(mec.mec_dpi) = :mecanicoDpi)
    `;

    let queryBuilder = await this.usuarioRepository
      .createQueryBuilder('usr')
      .leftJoinAndSelect('usr.cliente', 'cli')
      .leftJoinAndSelect('usr.mecanico', 'mec')
      .select([
        'usr.usrCodigo',
        'usr.usrEstado',
        'usr.usrAdministrador',
        'cli',
        'mec',
      ]);

    if (sort.length > 0) {
      queryBuilder = queryBuilder.orderBy(
        `${camelToSnakeCase(splitSortValues[0])}`,
        transformToAscOrDesc(splitSortValues[1]),
      );
    }

    const content = await queryBuilder
      .where(filters, parameters)
      .limit(size)
      .offset(skip)
      .getMany();

    const totalElements = await queryBuilder
      .select('count(*)')
      .where(filters, parameters)
      .getCount();

    const totalPages = Math.ceil(totalElements / size);
    const response = new PaginationResponseDto<Usuario>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findUsuarioByMecanico(mecCodigo: number) {
    const mecanico = await this.mecanicoService.findOne(mecCodigo);
    const usuario = await this.usuarioRepository.findOneBy({ mecanico });
    if (!usuario) {
      return;
    }

    throw new BadRequestException(
      `Ya existe un usuario para el mécanico ${mecanico.mecNombres}`,
    );
  }

  async findUsuarioByCliente(cliCodigo: number) {
    const cliente = await this.clienteService.findOne(cliCodigo);
    const usuario = await this.usuarioRepository.findOneBy({ cliente });
    if (!usuario) {
      return;
    }

    throw new BadRequestException(
      `Ya existe un usuario para el cliente ${cliente.cliNombres}`,
    );
  }

  async findOne(usrCodigo: number) {
    const usuario = await this.usuarioRepository.findOne({
      relations: ['cliente', 'mecanico'],
      where: { usrCodigo },
    });
    if (!usuario) {
      throw new BadRequestException(
        `No existe usuario con el código ${usrCodigo}`,
      );
    }

    return usuario;
  }

  async update(usrCodigo: number, updateUsuarioDto: UpdateUsuarioDto) {
    let queryRunner: QueryRunner;
    let response: Usuario;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = Usuario.fromUpdateDto(updateUsuarioDto);
      updateUsuarioDto.usrCodigo = usrCodigo;
      if (!updateUsuarioDto.cliCodigo && !updateUsuarioDto.mecCodigo) {
        throw new BadRequestException('Debe seleccionar un tipo de usuario');
      }

      if (updateUsuarioDto.cliCodigo && updateUsuarioDto.mecCodigo) {
        throw new BadRequestException(
          'El usuario únicamente puede ser cliente o mecanico',
        );
      }

      if (updateUsuarioDto.usrAdministrador && updateUsuarioDto.cliCodigo) {
        throw new BadRequestException(
          'Un cliente no puede ser usuario administrador',
        );
      }

      if (updateUsuarioDto.mecCodigo) {
        await this.findUsuarioByMecanico(updateUsuarioDto.mecCodigo);
        entity.mecanico = await this.mecanicoService.findOne(
          updateUsuarioDto.mecCodigo,
        );
      }
      if (updateUsuarioDto.cliCodigo) {
        await this.findUsuarioByCliente(updateUsuarioDto.cliCodigo);
        entity.cliente = await this.clienteService.findOne(
          updateUsuarioDto.cliCodigo,
        );
      }
      const salt = await bcrypt.genSalt();
      entity.usrContrasenia = await bcrypt.hash(
        updateUsuarioDto.usrContrasenia,
        salt,
      );
      response = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    delete response.usrContrasenia;
    return response;
  }

  async remove(usrCodigo: number) {
    const usuario = await this.findOne(usrCodigo);
    await this.usuarioRepository.remove(usuario);
  }
}
