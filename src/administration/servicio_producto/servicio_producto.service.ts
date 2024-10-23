import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicioProductoDto } from './dto/create-servicio_producto.dto';
import { UpdateServicioProductoDto } from './dto/update-servicio_producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ServicioService } from '../servicio/servicio.service';
import { ServicioProducto } from './entities/servicio_producto.entity';
import { ProductoService } from '../producto/producto.service';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { ServicioProductoPaginationFiltersDto } from './dto/servicio-producto-pagination-filters.dto';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class ServicioProductoService {
  constructor(
    @InjectRepository(ServicioProducto)
    private readonly servicioProductoRepository: Repository<ServicioProducto>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly servicioService: ServicioService,
    private readonly productoService: ProductoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createServicioProductoDto: CreateServicioProductoDto,
  ): Promise<ServicioProducto> {
    let queryRunner: QueryRunner;
    let response: ServicioProducto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const servicio = await this.servicioService.findOne(
        createServicioProductoDto.srvCodigo,
      );
      const producto = await this.productoService.findOne(
        createServicioProductoDto.proCodigo,
      );
      const entity = ServicioProducto.fromCreateDto(createServicioProductoDto);
      entity.servicio = servicio;
      entity.producto = producto;
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
    servicioProductoPaginationFilter: ServicioProductoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<ServicioProducto>> {
    const {
      size = 10,
      page = 0,
      sort = 'srrCantidad,asc',
      servicio = '',
      producto = '',
    } = servicioProductoPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      servicio: convertToLikeParameter(servicio),
      producto: convertToLikeParameter(producto),
    };

    const filters = `
      (:servicio = '' or lower(srv.srv_nombre) like :servicio) and
      (:producto = '' or lower(pro.pro_nombre) like :producto)
    `;

    const queryBuilder = await this.servicioProductoRepository
      .createQueryBuilder('srp')
      .innerJoinAndSelect('srp.servicio', 'srv')
      .innerJoinAndSelect('srp.producto', 'pro');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `srp.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<ServicioProducto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(srpCodigo: number) {
    const servicioProducto = await this.servicioProductoRepository.findOne({
      relations: ['servicio', 'producto'],
      where: { srpCodigo },
    });
    if (!servicioProducto) {
      throw new BadRequestException(
        `No existe servicio producto con el codigo ${srpCodigo}`,
      );
    }

    return servicioProducto;
  }

  async findByServicio(srvCodigo: number) {
    return this.productoRepository.find();
  }

  async update(
    srpCodigo: number,
    updateServicioProductoDto: UpdateServicioProductoDto,
  ) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(srpCodigo);
      updateServicioProductoDto.srpCodigo = srpCodigo;
      const servicio = await this.servicioService.findOne(
        updateServicioProductoDto.srvCodigo,
      );
      const producto = await this.productoService.findOne(
        updateServicioProductoDto.proCodigo,
      );
      const servicioRepuesto = ServicioProducto.fromUpdateDto(
        updateServicioProductoDto,
      );
      servicioRepuesto.servicio = servicio;
      servicioRepuesto.producto = producto;
      await queryRunner.manager.save(servicioRepuesto);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(srpCodigo: number) {
    const servicioProducto = await this.findOne(srpCodigo);
    await this.servicioProductoRepository.remove(servicioProducto);
  }

  async servicioProductoPorProducto(producto: Producto) {
    const servicioProducto = await this.servicioProductoRepository.findOneBy({
      producto,
    });

    if (!servicioProducto) {
      throw new BadRequestException(
        `El servicio no tiene habilitado el producto ${producto.proNombre}`,
      );
    }
  }
}
