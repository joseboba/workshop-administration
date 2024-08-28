import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMarcaVehiculoDto, UpdateMarcaVehiculoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MarcaVehiculo } from './entities/marca_vehiculo.entity';
import { PaginationResponseDto } from '../../commons';
import { MarcaVehiculoPaginationFiltersDto } from './dto/marca-vehiculo-pagination-filters.dto';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { TipoVehiculo } from '../tipo_vehiculo/entities/tipo_vehiculo.entity';

@Injectable()
export class MarcaVehiculoService {
  constructor(
    @InjectRepository(MarcaVehiculo)
    private readonly marcaVehiculoRepository: Repository<MarcaVehiculo>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createMarcaVehiculoDto: CreateMarcaVehiculoDto,
  ): Promise<MarcaVehiculo> {
    let queryRunner: QueryRunner;
    let response: MarcaVehiculo;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        MarcaVehiculo.fromCreateDto(createMarcaVehiculoDto),
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
    marcaVehiculoPaginationFilters: MarcaVehiculoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<MarcaVehiculo>> {
    const {
      size = 10,
      page = 0,
      sort = 'mveNombre,asc',
      search = '',
    } = marcaVehiculoPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or LOWER(mv.mve_nombre) like :nombre)
    `;

    const queryBuilder =
      await this.marcaVehiculoRepository.createQueryBuilder('mv');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `mv.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<MarcaVehiculo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(mveCodigo: number): Promise<MarcaVehiculo> {
    const marcaVehiculo = await this.marcaVehiculoRepository.findOneBy({
      mveCodigo,
    });
    if (!marcaVehiculo) {
      throw new BadRequestException(
        `No existe marca vehiculo con el código ${mveCodigo}`,
      );
    }

    return marcaVehiculo;
  }

  async update(
    mveCodigo: number,
    updateMarcaVehiculoDto: UpdateMarcaVehiculoDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(mveCodigo);
      updateMarcaVehiculoDto.mveCodigo = mveCodigo;
      const marcaVehiculo = MarcaVehiculo.fromUpdateDto(updateMarcaVehiculoDto);
      await queryRunner.manager.save(marcaVehiculo);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(mveCodigo: number) {
    const marcaVehiculo = await this.findOne(mveCodigo);
    await this.marcaVehiculoRepository.remove(marcaVehiculo);
  }
}
