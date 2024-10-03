import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateTipoRepuestoDto,
  TipoRepuestoPaginationFiltersDto,
  UpdateTipoRepuestoDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoRepuesto } from './entities/tipo_repuesto.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { PaginationResponseDto } from '../../commons';

@Injectable()
export class TipoRepuestoService {
  constructor(
    @InjectRepository(TipoRepuesto)
    private readonly tipoRepuestoRepository: Repository<TipoRepuesto>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTipoRepuestoDto: CreateTipoRepuestoDto,
  ): Promise<TipoRepuesto> {
    let queryRunner: QueryRunner;
    let response: TipoRepuesto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = TipoRepuesto.fromCreateDto(createTipoRepuestoDto);
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
    tipoRepuestoPaginationFilters: TipoRepuestoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<TipoRepuesto>> {
    const {
      size = 10,
      page = 0,
      sort = 'trpNombre,asc',
      search = '',
    } = tipoRepuestoPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or LOWER(tr.trp_nombre) like :nombre) OR
      (:descripcion = '' or LOWER(tr.trp_descripcion) like :descripcion)
    `;

    const queryBuilder =
      await this.tipoRepuestoRepository.createQueryBuilder('tr');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `tr.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<TipoRepuesto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(trpCodigo: number): Promise<TipoRepuesto> {
    const tipoRepuesto = await this.tipoRepuestoRepository.findOneBy({
      trpCodigo,
    });

    if (!tipoRepuesto) {
      throw new BadRequestException(
        `No existe tipo de repuesto con el código ${trpCodigo}`,
      );
    }

    return tipoRepuesto;
  }

  async update(
    trpCodigo: number,
    updateTipoRepuestoDto: UpdateTipoRepuestoDto,
  ) {
    let queryRunner: QueryRunner;
    let response: TipoRepuesto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(trpCodigo);
      updateTipoRepuestoDto.trpCodigo = trpCodigo;
      const entity = TipoRepuesto.fromUpdateDto(updateTipoRepuestoDto);
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

  async remove(trpCodigo: number) {
    const tipoRepuesto = await this.findOne(trpCodigo);
    await this.tipoRepuestoRepository.remove(tipoRepuesto);
  }
}
