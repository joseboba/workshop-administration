import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { CitaPaginationFiltersDto } from './dto/cita-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { VehiculoService } from '../vehiculo/vehiculo.service';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, convertToLikeParameter, transformToAscOrDesc } from '../../util';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    private readonly vehiculoService: VehiculoService,
    private readonly dataSource: DataSource,
  ) {
  }

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    let queryRunner: QueryRunner;
    let response: Cita;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const vehiculo = await this.vehiculoService.findOne(
        createCitaDto.vehPlaca,
      );
      const entity = Cita.fromCreateDto(createCitaDto);
      entity.ctaFechaCreacion = new Date();
      entity.vehiculo = vehiculo;
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
    citaPaginationFilter: CitaPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Cita>> {
    const {
      size = 10,
      page = 0,
      sort = 'vehPlaca,asc',
      search = '',
      inicioFechaCreacion = null,
      finFechaCreacion = null,
    } = citaPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      descripcion: convertToLikeParameter(search),
      inicioFechaCreacion,
      finFechaCreacion,
    };

    let filters = `
      (:descripcion = '' or lower(cta.cta_descripcion) like :descripcion)
    `;

    if (inicioFechaCreacion && finFechaCreacion) {
      filters += ` AND cta.cta_fecha_creacion BETWEEN :inicioFechaCreacion AND :finFechaCreacion`;
      parameters.inicioFechaCreacion = inicioFechaCreacion;
      parameters.finFechaCreacion = finFechaCreacion;
    }

    const queryBuilder = await this.citaRepository
      .createQueryBuilder('cta')
      .innerJoinAndSelect('cta.vehiculo', 'veh');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `cta.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Cita>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(ctaCodigo: number): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      relations: ['vehiculo'],
      where: { ctaCodigo },
    });
    if (!cita) {
      throw new BadRequestException(
        `No existe cita con el codigo ${ctaCodigo}`,
      );
    }

    return cita;
  }

  async update(ctaCodigo: number, updateCitaDto: UpdateCitaDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await this.findOne(ctaCodigo);
      updateCitaDto.ctaCodigo = ctaCodigo;
      const vehiculo = await this.vehiculoService.findOne(
        updateCitaDto.vehPlaca,
      );
      const cita = Cita.fromUpdateDto(updateCitaDto);
      cita.vehiculo = vehiculo;
      await queryRunner.manager.save(cita);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(ctaCodigo: number) {
    const cita = await this.findOne(ctaCodigo);
    await this.citaRepository.remove(cita);
  }
}
