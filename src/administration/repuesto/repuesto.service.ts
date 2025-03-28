import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRepuestoDto, UpdateRepuestoDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repuesto } from './entities/repuesto.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ProveedorService } from '../proveedor/proveedor.service';
import { TipoRepuestoService } from '../tipo_repuesto/tipo_repuesto.service';
import { RepuestoPaginationFiltersDto } from './dto/repuesto-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  Format,
  transformToAscOrDesc,
} from '../../util';
import { RepuestosMasMenosCarosDto } from '../../data/reports/filters/repuestos-mas-menos-caros.dto';

@Injectable()
export class RepuestoService {
  constructor(
    @InjectRepository(Repuesto)
    private readonly repuestoRepository: Repository<Repuesto>,
    private readonly proveedorService: ProveedorService,
    private readonly tipoRepuestoService: TipoRepuestoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRepuestoDto: CreateRepuestoDto): Promise<Repuesto> {
    let queryRunner: QueryRunner;
    let response: Repuesto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const proveedor = await this.proveedorService.findOne(
        createRepuestoDto.prvCodigo,
      );
      const tipoRepuesto = await this.tipoRepuestoService.findOne(
        createRepuestoDto.trpCodigo,
      );

      const entity = Repuesto.fromCreateDto(createRepuestoDto);
      entity.proveedor = proveedor;
      entity.tipoRepuesto = tipoRepuesto;
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
    repuestoPaginationFilter: RepuestoPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Repuesto>> {
    const {
      size = 10,
      page = 0,
      sort = 'repNombre,asc',
      search = '',
    } = repuestoPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      nombre: convertToLikeParameter(search),
      descripcion: convertToLikeParameter(search),
    };

    const filters = `
      (:nombre = '' or LOWER(rp.rep_nombre) like :nombre) OR
      (:descripcion = '' or LOWER(rp.rep_descripcion) like :descripcion)
    `;

    const queryBuilder = await this.repuestoRepository
      .createQueryBuilder('rp')
      .innerJoinAndSelect('rp.proveedor', 'p')
      .innerJoinAndSelect('rp.tipoRepuesto', 'tp');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `rp.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Repuesto>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(repCodigo: number) {
    const repuesto = await this.repuestoRepository.findOne({
      relations: ['proveedor', 'tipoRepuesto'],
      where: { repCodigo },
    });
    if (!repuesto) {
      throw new BadRequestException(
        `No existe repuesto con el id ${repCodigo}`,
      );
    }

    return repuesto;
  }

  async update(repCodigo: number, updateRepuestoDto: UpdateRepuestoDto) {
    let queryRunner: QueryRunner;
    let response: Repuesto;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(repCodigo);
      updateRepuestoDto.repCodigo = repCodigo;
      const proveedor = await this.proveedorService.findOne(
        updateRepuestoDto.prvCodigo,
      );
      const tipoRepuesto = await this.tipoRepuestoService.findOne(
        updateRepuestoDto.trpCodigo,
      );
      const entity = Repuesto.fromUpdateDto(updateRepuestoDto);
      entity.proveedor = proveedor;
      entity.tipoRepuesto = tipoRepuesto;
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

  async remove(repCodigo: number) {
    const repuesto = await this.findOne(repCodigo);
    await this.repuestoRepository.remove(repuesto);
  }

  async repuestosMasMenosCaros(
    filters: RepuestosMasMenosCarosDto,
    order: 'ASC' | 'DESC',
  ): Promise<
    {
      codigo: number;
      nombreProveedor: string;
      precio: string;
      cantidad: string;
      nombre: string;
    }[]
  > {
    const primitiveValues = await this.repuestoRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.proveedor', 'p')
      .select('r.rep_nombre', 'nombre')
      .addSelect('r.rep_codigo', 'codigo')
      .addSelect('r.rep_cantidad_disponible', 'cantidad')
      .addSelect('r.rep_precio', 'precio')
      .addSelect('p.prv_nombre', 'nombreProveedor')
      .where(
        `
        (:proveedor = 0 or p.prv_codigo = :proveedor) and
        (:tipoRepuesto = 0 or r.trp_codigo = :tipoRepuesto)
      `,
        { proveedor: filters.proveedor, tipoRepuesto: filters.tipoRepuesto },
      )
      .orderBy('precio', order)
      .limit(10)
      .getRawMany<{
        codigo: number;
        nombre: string;
        cantidad: number;
        precio: number;
        nombreProveedor: string;
      }>();

    return primitiveValues.map(
      ({ codigo, nombre, cantidad, precio, nombreProveedor }) => ({
        codigo,
        nombre,
        cantidad: Format.formatNumber(cantidad),
        precio: Format.formatCurrency(precio),
        nombreProveedor,
      }),
    );
  }

  async descontarRepuesto(repCodigo: number, cantidad: number) {
    const repuesto = await this.findOne(repCodigo);
    repuesto.repCantidadDisponible -= cantidad;
    await this.repuestoRepository.save(repuesto);
  }
}
