import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNivelGravedadDto, UpdateNivelGravedadDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NivelGravedad } from './entities/nivel_gravedad.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { NivelGravedadPaginationFiltersDto } from './dto/nivel-gravedad-pagination-filters.dto';

@Injectable()
export class NivelGravedadService {
  constructor(
    @InjectRepository(NivelGravedad)
    private readonly nivelGravedadRepository: Repository<NivelGravedad>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createNivelGravedadDto: CreateNivelGravedadDto,
  ): Promise<NivelGravedad> {
    let queryRunner: QueryRunner;
    let response: NivelGravedad;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const entity = NivelGravedad.fromCreateDto(createNivelGravedadDto);
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
    nivelGravedadPaginationFilters: NivelGravedadPaginationFiltersDto,
  ): Promise<PaginationResponseDto<NivelGravedad>> {
    const {
      size = 10,
      page = 0,
      sort = 'ngrNombre,asc',
      search = '',
    } = nivelGravedadPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      detalle: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or LOWER(ng.ngr_nombre) like :nombre) OR
      (:detalle = '' or LOWER(ng.ngr_detalle) like :detalle)
    `;

    const queryBuilder =
      await this.nivelGravedadRepository.createQueryBuilder('ng');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `ng.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<NivelGravedad>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(ngrCodigo: number): Promise<NivelGravedad> {
    const nivelGravedad = await this.nivelGravedadRepository.findOneBy({
      ngrCodigo,
    });

    if (!nivelGravedad) {
      throw new BadRequestException(
        `No existe nivel de gravedad con el código ${ngrCodigo}`,
      );
    }

    return nivelGravedad;
  }

  async update(
    ngrCodigo: number,
    updateNivelGravedadDto: UpdateNivelGravedadDto,
  ) {
    let queryRunner: QueryRunner;
    let response: NivelGravedad;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(ngrCodigo);
      updateNivelGravedadDto.ngrCodigo = ngrCodigo;
      const entity = NivelGravedad.fromUpdateDto(updateNivelGravedadDto);
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

  async remove(ngrCodigo: number) {
    const nivelGravedad = await this.findOne(ngrCodigo);
    await this.nivelGravedadRepository.remove(nivelGravedad);
  }
}
