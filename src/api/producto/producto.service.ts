import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { MarcaProductoService } from '../marca_producto/marca_producto.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';
import { ProductoPaginationFiltersDto } from './dto/producto-pagination-filters.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly marcaProductoService: MarcaProductoService,
    private readonly proveedorService: ProveedorService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    let queryRunner: QueryRunner;
    let response: Producto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const marcaProducto = await this.marcaProductoService.findOne(
        createProductoDto.mapCodigo,
      );
      const proveedor = await this.proveedorService.findOne(
        createProductoDto.prvCodigo,
      );
      const entity = Producto.fromCreateDto(createProductoDto);
      entity.marcaProducto = marcaProducto;
      entity.proveedor = proveedor;
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
    productoPaginationFilters: ProductoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Producto>> {
    const {
      size = 10,
      page = 0,
      sort = 'proNombre,asc',
      search = '',
    } = productoPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or lower(pro.pro_nombre) like :nombre) or
      (:descripcion = '' or lower(pro.pro_descripcion) like :descripcion)
    `;

    const queryBuilder = await this.productoRepository
      .createQueryBuilder('pro')
      .innerJoinAndSelect('pro.proveedor', 'prv')
      .innerJoinAndSelect('pro.marcaProducto', 'map');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `pro.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Producto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(proCodigo: number): Promise<Producto> {
    const vehiculo = await this.productoRepository.findOne({
      relations: ['proveedor', 'marcaProducto'],
      where: { proCodigo },
    });
    if (!vehiculo) {
      throw new BadRequestException(
        `No existe producto con la código ${proCodigo}`,
      );
    }

    return vehiculo;
  }

  async update(proCodigo: number, updateProductoDto: UpdateProductoDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(proCodigo);
      updateProductoDto.proCodigo = proCodigo;
      const marcaProducto = await this.marcaProductoService.findOne(
        updateProductoDto.mapCodigo,
      );
      const proveedor = await this.proveedorService.findOne(
        updateProductoDto.prvCodigo,
      );
      const entity = Producto.fromUpdateDto(updateProductoDto);
      entity.marcaProducto = marcaProducto;
      entity.proveedor = proveedor;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(proCodigo: number) {
    const producto = await this.findOne(proCodigo);
    await this.productoRepository.remove(producto);
  }
}
