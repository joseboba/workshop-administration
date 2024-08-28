import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoServicio } from './entities/tipo_servicio.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../commons';
import {
  CreateTipoServicioDto,
  TipoServicioPaginationFiltersDto,
  UpdateTipoServicioDto,
} from './dto';
import { NoContentException } from '../../util/exceptions';
import { camelToSnakeCase, transformToAscOrDesc } from '../../util';

@Injectable()
export class TipoServicioService {
  constructor(
    @InjectRepository(TipoServicio)
    private readonly tipoServicioRepository: Repository<TipoServicio>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTipoServicioDto: CreateTipoServicioDto,
  ): Promise<TipoServicio> {
    let queryRunner: QueryRunner;
    let response: TipoServicio;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        TipoServicio.fromCreateDto(createTipoServicioDto),
      );
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
    tipoServicioPaginationFilters: TipoServicioPaginationFiltersDto,
  ): Promise<PaginationResponseDto<TipoServicio>> {
    const {
      size = 10,
      page = 0,
      sort = 'tsrCodigo,asc',
      search = '',
    } = tipoServicioPaginationFilters;

    const skip = page * size;
    const splitSortValues = sort.split(',');
    const isValidSearch = !!search.trim();
    const likeSearch = isValidSearch ? `%${search.toLocaleLowerCase()}%` : '';
    const queryBuilder = this.tipoServicioRepository.createQueryBuilder('ts');

    const parameters = {
      nombre: likeSearch,
      descripcion: likeSearch,
    };

    const where = `
      (:nombre = '' or ts.tsr_nombre like :nombre) or
      (:descripcion = '' or ts.tsr_descripcion like :descripcion)
    `;

    const content = await queryBuilder
      .where(where, parameters)
      .orderBy(
        `s.${camelToSnakeCase(splitSortValues[0])}`,
        transformToAscOrDesc(splitSortValues[1]),
      )
      .limit(size)
      .offset(skip)
      .getMany();

    const totalElements = await queryBuilder
      .select('count(*)')
      .where(where, parameters)
      .getCount();

    const totalPages = Math.ceil(totalElements / size);

    const response = new PaginationResponseDto<TipoServicio>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(tsrCodigo: number): Promise<TipoServicio> {
    const tipoServicio = await this.tipoServicioRepository.findOneBy({
      tsrCodigo,
    });
    if (!tipoServicio) {
      throw new BadRequestException(
        `No existe tipo servicio con el id ${tsrCodigo}`,
      );
    }
    return tipoServicio;
  }

  async update(
    tsrCodigo: number,
    updateTipoServicioDto: UpdateTipoServicioDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(tsrCodigo);
      updateTipoServicioDto.tsrCodigo = tsrCodigo;
      const tipoServicio = TipoServicio.fromUpdateDto(updateTipoServicioDto);
      await queryRunner.manager.save(tipoServicio);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(tsrCodigo: number) {
    const tipoServicio = await this.findOne(tsrCodigo);
    await this.tipoServicioRepository.remove(tipoServicio);
  }
}
