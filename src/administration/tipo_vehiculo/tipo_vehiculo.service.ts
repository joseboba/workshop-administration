import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipoVehiculoDto, TipoVehiculoPaginationFiltersDto, UpdateTipoVehiculoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { TipoVehiculo } from './entities/tipo_vehiculo.entity';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';
import { PaginationResponseDto } from '../../commons';
import { TipoVehiculoModule } from './tipo_vehiculo.module';

@Injectable()
export class TipoVehiculoService {
  constructor(
    @InjectRepository(TipoVehiculo)
    private readonly tipoVehiculoRepository: Repository<TipoVehiculo>,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(
    createTipoVehiculoDto: CreateTipoVehiculoDto,
  ): Promise<TipoVehiculo> {
    let queryRunner: QueryRunner;
    let response: TipoVehiculo;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        TipoVehiculo.fromCreateDto(createTipoVehiculoDto),
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
    tipoVehiculoPaginationFiltersDto: TipoVehiculoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<TipoVehiculo>> {
    const {
      size = 10,
      page = 0,
      sort = 'tveNombre,asc',
      search = '',
    } = tipoVehiculoPaginationFiltersDto;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(tve.tve_nombre) like :nombre) or
      (:descripcion = '' or lower(tve.tve_descripcion) like :descripcion)
    `;

    const queryBuilder =
      await this.tipoVehiculoRepository.createQueryBuilder('tve');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `tve.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<TipoVehiculo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(tveCodigo: number): Promise<TipoVehiculo> {
    const tipoVehiculo = await this.tipoVehiculoRepository.findOneBy({
      tveCodigo,
    });
    if (!tipoVehiculo) {
      throw new BadRequestException(
        `No existe tipo de vehiculo con el código ${tveCodigo}`,
      );
    }

    return tipoVehiculo;
  }

  async update(
    tveCodigo: number,
    updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(tveCodigo);
      updateTipoVehiculoDto.tveCodigo = tveCodigo;
      const tipoVehiculo = TipoVehiculo.fromUpdateDto(updateTipoVehiculoDto);
      await queryRunner.manager.save(tipoVehiculo);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(tveCodigo: number) {
    const tipoVehiculo = await this.findOne(tveCodigo);
    await this.tipoVehiculoRepository.remove(tipoVehiculo);
  }
}
