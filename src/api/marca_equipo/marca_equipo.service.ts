import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMarcaEquipoDto } from './dto/create-marca_equipo.dto';
import { UpdateMarcaEquipoDto } from './dto/update-marca_equipo.dto';
import { MarcaEquipoPaginationFiltersDto } from './dto/marca-equipo-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MarcaEquipo } from './entities/marca_equipo.entity';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class MarcaEquipoService {
  constructor(
    @InjectRepository(MarcaEquipo)
    private readonly marcaEquipoRepository: Repository<MarcaEquipo>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(
    createMarcaEquipoDto: CreateMarcaEquipoDto,
  ): Promise<MarcaEquipo> {
    let queryRunner: QueryRunner;
    let response: MarcaEquipo;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        MarcaEquipo.fromCreateDto(createMarcaEquipoDto),
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
    marcaEquipoPaginationFilters: MarcaEquipoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<MarcaEquipo>> {
    const {
      size = 10,
      page = 0,
      sort = 'meqNombre,asc',
      search = '',
    } = marcaEquipoPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or mq.meq_nombre like :nombre) or
      (:descripcion = '' or mq.meq_descripcion like :descripcion)
    `;

    const queryBuilder =
      await this.marcaEquipoRepository.createQueryBuilder('mq');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `mq.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<MarcaEquipo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(meqCodigo: number): Promise<MarcaEquipo> {
    const marcaEquipo = await this.marcaEquipoRepository.findOneBy({
      meqCodigo,
    });
    if (!marcaEquipo) {
      throw new BadRequestException(
        `No existe tipo de vehiculo con el cóigo ${meqCodigo}`,
      );
    }

    return marcaEquipo;
  }

  async update(meqCodigo: number, updateMarcaEquipoDto: UpdateMarcaEquipoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(meqCodigo);
      updateMarcaEquipoDto.meqCodigo = meqCodigo;
      const tipoServicio = MarcaEquipo.fromUpdateDto(updateMarcaEquipoDto);
      await queryRunner.manager.save(tipoServicio);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(meqCodigo: number) {
    const marcaVehiculo = await this.findOne(meqCodigo);
    await this.marcaEquipoRepository.remove(marcaVehiculo);
  }
}
