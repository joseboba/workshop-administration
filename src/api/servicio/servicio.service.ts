import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateServicioDto,
  ServicioPaginationFiltersDto,
  UpdateServicioDto,
} from './dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoServicioService } from '../tipo_servicio/tipo_servicio.service';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, transformToAscOrDesc } from '../../util';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    private readonly tipoServicioService: TipoServicioService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    let queryRunner: QueryRunner;
    let response: Servicio;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const tipoServicio = await this.tipoServicioService.findOne(
        createServicioDto.tsrCodigo,
      );
      const entity = Servicio.fromCreateDto(createServicioDto);
      entity.tipoServicio = tipoServicio;
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
    servicioPaginationFilters: ServicioPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Servicio>> {
    const {
      size = 10,
      page = 0,
      sort = 'srvCodigo,asc',
      tsrCodigo,
      search = '',
    } = servicioPaginationFilters;

    const skip = page * size;
    const splitSortValues = sort.split(',');
    const isValidSearch = !!search.trim();
    const likeSearch = isValidSearch ? `%${search.toLocaleLowerCase()}%` : '';

    const parameters = {
      tsrCodigo: tsrCodigo ? tsrCodigo : 0,
      nombre: likeSearch,
      descripcion: likeSearch,
    };
    const filters = `
      (:tsrCodigo = 0 or s.tsr_codigo = :tsrCodigo) and
      (
        (:nombre = '' or LOWER(s.srv_nombre) like :nombre) or
        (:descripcion = '' or LOWER(s.srv_descripcion) like :descripcion)
      )
    `;

    const queryBuilder = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.tipoServicio', 'ts');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `s.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Servicio>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(srvCodigo: number) {
    const servicio = await this.servicioRepository.findOne({
      relations: ['tipoServicio'],
      where: {
        srvCodigo,
      },
    });

    if (!servicio) {
      throw new BadRequestException(
        `No existe servicio con el id ${srvCodigo}`,
      );
    }

    return servicio;
  }

  async update(srvCodigo: number, updateServicioDto: UpdateServicioDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      updateServicioDto.srvCodigo = srvCodigo;
      await this.findOne(srvCodigo);
      const tipoServicio = await this.tipoServicioService.findOne(
        updateServicioDto.srvCodigo,
      );
      const servicio = Servicio.fromUpdateDto(updateServicioDto);
      servicio.tipoServicio = tipoServicio;
      await queryRunner.manager.save(servicio);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(srvCodigo: number) {
    const servicio = await this.findOne(srvCodigo);
    await this.servicioRepository.remove(servicio);
  }
}
