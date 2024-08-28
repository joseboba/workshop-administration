import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { CotizacionPaginationFiltersDto } from './dto/cotizacion-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ClienteService } from '../cliente/cliente.service';
import { Cotizacion } from './entities/cotizacion.entity';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, transformToAscOrDesc } from '../../util';

@Injectable()
export class CotizacionService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    private readonly clienteService: ClienteService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    let queryRunner: QueryRunner;
    let response: Cotizacion;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cliente = await this.clienteService.findOne(
        createCotizacionDto.cliCodigo,
      );
      const entity = Cotizacion.fromCreateDto(createCotizacionDto);
      entity.cliente = cliente;
      entity.cotFechaCreacion = new Date();
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
    cotizacionPaginationFilters: CotizacionPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Cotizacion>> {
    const {
      size = 10,
      page = 0,
      sort = 'cotFechaCreacion,asc',
      inicioFechaCreacion = null,
      finFechaCreacion = null,
      inicioFechaVencimiento = null,
      finFechaVencimiento = null,
    } = cotizacionPaginationFilters;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      inicioFechaCreacion,
      finFechaCreacion,
      inicioFechaVencimiento,
      finFechaVencimiento,
    };

    let filters = '';

    if (inicioFechaCreacion && finFechaCreacion) {
      filters += `cot.cot_fecha_creacion BETWEEN :inicioFechaCreacion AND :finFechaCreacion `;
      parameters.inicioFechaCreacion = inicioFechaCreacion;
      parameters.finFechaCreacion = finFechaCreacion;
    }

    if (inicioFechaVencimiento && finFechaVencimiento) {
      filters += `cot.cot_fecha_vencimiento BETWEEN :inicioFechaVencimiento AND :finFechaVencimiento`;
      parameters.inicioFechaVencimiento = inicioFechaVencimiento;
      parameters.finFechaVencimiento = finFechaVencimiento;
    }

    const queryBuilder = await this.cotizacionRepository
      .createQueryBuilder('cot')
      .innerJoinAndSelect('cot.cliente', 'cli');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `cot.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Cotizacion>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(cotCodigo: number): Promise<Cotizacion> {
    const Cotizacionn = await this.cotizacionRepository.findOne({
      relations: ['cliente'],
      where: { cotCodigo },
    });
    if (!Cotizacionn) {
      throw new BadRequestException(
        `No existe cootización con el código ${cotCodigo}`,
      );
    }

    return Cotizacionn;
  }

  async update(cotCodigo: number, updateCotizacionnDto: UpdateCotizacionDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(cotCodigo);
      updateCotizacionnDto.cotCodigo = cotCodigo;
      const cliente = await this.clienteService.findOne(
        updateCotizacionnDto.cliCodigo,
      );
      const cotizacion = Cotizacion.fromUpdateDto(updateCotizacionnDto);
      cotizacion.cliente = cliente;
      await queryRunner.manager.save(cotizacion);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(cotCodigo: number) {
    const Cotizacionn = await this.findOne(cotCodigo);
    await this.cotizacionRepository.remove(Cotizacionn);
  }
}
