import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateMecanicoDto,
  MecanicoPaginationFiltersDto,
  UpdateMecanicoDto,
} from './dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Mecanico } from './entities/mecanico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EspecialidadMecanicaService } from '../especialidad_mecanica/especialidad_mecanica.service';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { PaginationResponseDto } from '../../commons';
import { Cliente } from '../cliente/entities/cliente.entity';

@Injectable()
export class MecanicoService {
  constructor(
    @InjectRepository(Mecanico)
    private readonly mecanicoRepository: Repository<Mecanico>,
    private readonly especialidadMecanicaService: EspecialidadMecanicaService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createMecanicoDto: CreateMecanicoDto): Promise<Mecanico> {
    let queryRunner: QueryRunner;
    let response: Mecanico;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const especialidadMecanica =
        await this.especialidadMecanicaService.findOne(
          createMecanicoDto.emeCodigo,
        );
      const entity = Mecanico.fromCreateDto(createMecanicoDto);
      entity.especialidadMecanica = especialidadMecanica;
      response = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return response;
  }

  async findAll(
    mecanicoPaginationFilters: MecanicoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Mecanico>> {
    const {
      size = 10,
      page = 0,
      sort = 'mecNombres,asc',
      search = '',
      dpi = '',
      nit = '',
      telefono = '',
      correo = '',
    } = mecanicoPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombres: convertToLikeParameter(search),
      apellidos: convertToLikeParameter(search),
      dpi: convertToLikeParameter(dpi),
      nit: convertToLikeParameter(nit),
      telefono: convertToLikeParameter(telefono),
      correo: convertToLikeParameter(correo),
    };

    const filters = `
      (
        (:nombres = '' or m.cli_nombres like :nombres) OR
        (:apellidos = '' or m.cli_apellidos like :apellidos) 
      ) AND
      (:dpi = '' or m.cli_dpi like :dpi) AND
      (:nit = '' or m.cli_nit like :nit) AND
      (:telefono = '' or m.cli_telefono like :telefono) AND
      (:correo = '' or m.cli_correo like :correo) 
    `;

    const queryBuilder = await this.mecanicoRepository.createQueryBuilder('m');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `m.${camelToSnakeCase(splitSortValues[0])}`,
        transformToAscOrDesc(splitSortValues[1]),
      )
      .limit(size)
      .offset(skip)
      .getMany();

    const totalElements = await queryBuilder
      .select('count(*)')
      .where(filters, parameters)
      .getCount();

    const totalPages = Math.ceil(totalElements / size);
    const response = new PaginationResponseDto<Mecanico>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(mecCodigo: number): Promise<Mecanico> {
    const mecanico = await this.mecanicoRepository.findOneBy({
      mecCodigo,
    });

    if (!mecanico) {
      throw new BadRequestException(
        `No existe mecanico con el id ${mecCodigo}`,
      );
    }

    return mecanico;
  }

  async update(mecCodigo: number, updateMecanicoDto: UpdateMecanicoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(mecCodigo);
      updateMecanicoDto.mecCodigo = mecCodigo;
      await this.findOne(mecCodigo);
      const especialidadMecanica =
        await this.especialidadMecanicaService.findOne(
          updateMecanicoDto.emeCodigo,
        );
      const entity = Mecanico.fromUpdateDto(updateMecanicoDto);
      entity.especialidadMecanica = especialidadMecanica;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(mecCodigo: number) {
    const mecanico = await this.findOne(mecCodigo);
    await this.mecanicoRepository.remove(mecanico);
  }
}
