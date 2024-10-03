import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMarcaProductoDto } from './dto/create-marca_producto.dto';
import { UpdateMarcaProductoDto } from './dto/update-marca_producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaVehiculo } from '../marca_vehiculo/entities/marca_vehiculo.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MarcaProducto } from './entities/marca_producto.entity';
import { MarcaProductoPaginationFiltersDto } from './dto/marca-producto-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class MarcaProductoService {
  constructor(
    @InjectRepository(MarcaProducto)
    private readonly marcaProductoRepository: Repository<MarcaProducto>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createMarcaProductoDto: CreateMarcaProductoDto) : Promise<MarcaProducto> {
    let queryRunner: QueryRunner;
    let response: MarcaProducto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      response = await queryRunner.manager.save(
        MarcaProducto.fromCreateDto(createMarcaProductoDto),
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

  async findAll(marcaProductoPaginationFilter: MarcaProductoPaginationFiltersDto): Promise<PaginationResponseDto<MarcaProducto>> {
    const {
      size = 10,
      page = 0,
      sort = 'mapNombre,asc',
      search = '',
    } = marcaProductoPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(map.map_nombre) like :nombre)
    `;

    const queryBuilder =
      await this.marcaProductoRepository.createQueryBuilder('map');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `map.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<MarcaProducto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(mapCodigo: number): Promise<MarcaProducto> {
    const marcaProducto = await this.marcaProductoRepository.findOneBy({
      mapCodigo,
    });
    if (!marcaProducto) {
      throw new BadRequestException(
        `No existe marca de producto con el código ${mapCodigo}`,
      );
    }

    return marcaProducto;
  }

  async update(mapCodigo: number, updateMarcaProductoDto: UpdateMarcaProductoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(mapCodigo);
      updateMarcaProductoDto.mapCodigo = mapCodigo;
      const marcaProducto = MarcaProducto.fromUpdateDto(updateMarcaProductoDto);
      await queryRunner.manager.save(marcaProducto);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }  }

  async remove(mapCodigo: number) {
    const marcaProducto = await this.findOne(mapCodigo);
    await this.marcaProductoRepository.remove(marcaProducto);  }
}
