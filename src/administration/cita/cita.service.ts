import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { CitaPaginationFiltersDto } from './dto/cita-pagination-filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { VehiculoService } from '../vehiculo/vehiculo.service';
import { PaginationResponseDto } from '../../commons';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  Format,
  transformToAscOrDesc,
} from '../../util';
import { VehiculosMasNuevosAntiguosDto } from '../../data/reports/filters/vehiculos-mas-nuevos-antiguos.dto';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    private readonly vehiculoService: VehiculoService,
    private readonly dataSource: DataSource,
  ) {}

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
      status = null,
    } = citaPaginationFilter;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      descripcion: convertToLikeParameter(search),
      inicioFechaCreacion,
      finFechaCreacion,
      status,
    };

    let filters = `
      (:descripcion = '' or lower(cta.cta_descripcion) like :descripcion)
    `;

    if (inicioFechaCreacion && finFechaCreacion) {
      filters += ` AND cta.cta_fecha_creacion BETWEEN :inicioFechaCreacion AND :finFechaCreacion`;
      parameters.inicioFechaCreacion = inicioFechaCreacion;
      parameters.finFechaCreacion = finFechaCreacion;
    }

    if (status !== null) {
      filters += ` AND cta.cta_estado = :status`;
      parameters.status = status;
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
      relations: ['vehiculo', 'vehiculo.cliente'],
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

  async getDiaDeLaSemanaConMasMenosCitas(
    filters: VehiculosMasNuevosAntiguosDto,
  ) {
    const where = `
      (v.veh_placa ilike :placa) and
      (v.cli_codigo = :cliente) and
      (v.tve_codigo = :tipoVehiculo) and
      cta_fecha_hora between :start and :end
    `;

    const params = {
      place: `%${filters.placa}%`,
      cliente: filters.cliente,
      tipoVehiculo: filters.tipoVehiculo,
      start: filters.startDate,
      end: filters.endDate,
    };

    const allDays = await this.citaRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.vehiculo', 'v')
      .select(
        `
          CASE
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 1 THEN 'Lunes'
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 2 THEN 'Martes'
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 3 THEN 'Miércoles'
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 4 THEN 'Jueves'
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 5 THEN 'Viernes'
            WHEN EXTRACT(DOW FROM c.cta_fecha_hora) = 6 THEN 'Sábado'
            ELSE 'Domingo'
          END as dia
      `,
      )
      .addSelect('count(*)', 'numeroCitas')
      .where(where, params)
      .orderBy('dia', 'ASC')
      .groupBy('dia')
      .getRawMany<{
        dia: string;
        numeroCitas: string;
      }>();

    const citasQuery = await this.citaRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.vehiculo', 'v')
      .select(
        `
            CASE
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 1 THEN 'Lunes'
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 2 THEN 'Martes'
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 3 THEN 'Miércoles'
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 4 THEN 'Jueves'
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 5 THEN 'Viernes'
                WHEN EXTRACT(DOW FROM cta_fecha_hora) = 6 THEN 'Sábado'
                ELSE 'Domingo'
            END as dia
      `,
      )
      .where(where, params)
      .addSelect('count(*)', 'numeroCitas')
      .limit(1)
      .groupBy('dia');

    const menosCitas = await citasQuery
      .orderBy('count(*)', 'ASC')
      .getRawOne<{ dia: string; numeroCitas: string }>();

    const masCitas = await citasQuery
      .orderBy('count(*)', 'DESC')
      .getRawOne<{ dia: string; numeroCitas: string }>();

    const response: {
      allDays: { dia: string; numeroCitas: string }[];
      diaMenosCitas: { dia: string; numeroCitas: string };
      diaMasCitas: { dia: string; numeroCitas: string };
    } = {
      allDays: allDays.map((item) => ({
        dia: item.dia,
        numeroCitas: Format.formatNumber(+item.numeroCitas),
      })),
      diaMenosCitas: {
        dia: menosCitas.dia,
        numeroCitas: Format.formatNumber(+menosCitas.numeroCitas),
      },
      diaMasCitas: {
        dia: masCitas.dia,
        numeroCitas: Format.formatNumber(+masCitas.numeroCitas),
      },
    };

    return response;
  }

  async updateStatus(ctaCodigo: number) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const cita = await this.findOne(ctaCodigo);
      cita.ctaEstado = false;
      await queryRunner.manager.save(cita);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
