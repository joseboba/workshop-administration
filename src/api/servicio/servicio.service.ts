import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateServicioDto,
  ServicioPaginationFiltersDto,
  UpdateServicioDto,
} from './dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoServicioService } from '../tipo_servicio/tipo_servicio.service';
import { PaginationResponseDto } from '../../commons';
import { camelToSnakeCase, Format, transformToAscOrDesc } from '../../util';
import { ServicioOrdenTrabajo } from '../servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    private readonly tipoServicioService: TipoServicioService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    let queryRunner: QueryRunner;
    let response: Servicio;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const tipoServicio = await this.tipoServicioService.findOne(
        createServicioDto.tsrCodigo,
      );
      const entity = Servicio.fromCreateDto(createServicioDto);
      entity.tipoServicio = tipoServicio;
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
    servicioPaginationFilters: ServicioPaginationFiltersDto,
  ): Promise<PaginationResponseDto<Servicio>> {
    const {
      size = 10,
      page = 0,
      sort = 'srvCodigo,asc',
      tsrCodigo,
      search = '',
    } = servicioPaginationFilters;

    const skip = page * size;
    const splitSortValues = sort.split(',');
    const isValidSearch = !!search.trim();
    const likeSearch = isValidSearch ? `%${search.toLocaleLowerCase()}%` : '';

    const parameters = {
      tsrCodigo: tsrCodigo ? tsrCodigo : 0,
      nombre: likeSearch,
      descripcion: likeSearch,
    };
    const filters = `
      (:tsrCodigo = 0 or s.tsr_codigo = :tsrCodigo) and
      (
        (:nombre = '' or LOWER(s.srv_nombre) like :nombre) or
        (:descripcion = '' or LOWER(s.srv_descripcion) like :descripcion)
      )
    `;

    const queryBuilder = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.tipoServicio', 'ts');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `s.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<Servicio>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(srvCodigo: number) {
    const servicio = await this.servicioRepository.findOne({
      relations: [
        'tipoServicio',
        'serviciosRepuesto',
        'serviciosRepuesto.repuesto',
        'servicioProductos',
        'servicioProductos.producto',
      ],
      where: {
        srvCodigo,
      },
    });

    if (!servicio) {
      throw new BadRequestException(
        `No existe servicio con el id ${srvCodigo}`,
      );
    }

    return servicio;
  }

  async update(srvCodigo: number, updateServicioDto: UpdateServicioDto) {
    let queryRunner: QueryRunner;
    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      updateServicioDto.srvCodigo = srvCodigo;
      await this.findOne(srvCodigo);
      const tipoServicio = await this.tipoServicioService.findOne(
        updateServicioDto.tsrCodigo,
      );
      const servicio = Servicio.fromUpdateDto(updateServicioDto);
      servicio.tipoServicio = tipoServicio;
      await queryRunner.manager.save(servicio);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(srvCodigo: number) {
    const servicio = await this.findOne(srvCodigo);
    await this.servicioRepository.remove(servicio);
  }

  async serviciosMasMenosSolicitados(order: 'ASC' | 'DESC'): Promise<
    {
      codigo: number;
      nombre: string;
      costo: string;
      solicitudes: string;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .select('s.srv_codigo', 'codigo')
      .addSelect('s.srv_nombre', 'nombre')
      .addSelect('s.srv_costo', 'costo')
      .addSelect('count(tsot)', 'solicitudes')
      .groupBy('s.srv_codigo, s.srv_nombre, s.srv_costo')
      .orderBy('solicitudes', order)
      .limit(10)
      .getRawMany<{
        codigo: number;
        nombre: string;
        costo: number;
        solicitudes: number;
      }>();

    return primitiveValues.map(({ codigo, costo, solicitudes, nombre }) => ({
      codigo,
      costo: Format.formatCurrency(+costo),
      solicitudes: Format.formatNumber(+solicitudes),
      nombre,
    }));
  }

  async marcasDeCarrosMasAtendidas(): Promise<
    {
      nombre: string;
      cantidad: string;
      porcentaje: string;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .innerJoinAndSelect('tsot.ordenTrabajo', 'tot')
      .innerJoinAndSelect('tot.vehiculo', 'tv')
      .innerJoinAndSelect('tv.marcaVehiculo', 'tmv')
      .select('tmv.mve_nombre', 'nombre')
      .addSelect('count(tsot)', 'cantidad')
      .addSelect(
        `((select count(*) from taller_automotriz.taa_servicio_orden_trabajo) / COUNT(tsot)) * 100`,
        'porcentaje',
      )
      .groupBy('tmv.mve_nombre')
      .limit(10)
      .getRawMany<{
        nombre: string;
        cantidad: string;
        porcentaje: string;
      }>();

    return primitiveValues.map(({ porcentaje, cantidad, nombre }) => ({
      porcentaje: `${Format.formatDecimal(+porcentaje)}%`,
      nombre,
      cantidad: Format.formatNumber(+cantidad),
    }));
  }

  async getClientesMasRecurrentes(): Promise<
    {
      cliente: string;
      vehiculo: string;
      modelo: string;
      visitas: string;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .innerJoinAndSelect('tsot.ordenTrabajo', 'tot')
      .innerJoinAndSelect('tot.vehiculo', 'tv')
      .innerJoinAndSelect('tv.cliente', 'cli')
      .select(`cli.cli_nombres || ' ' || cli.cli_apellidos `, 'cliente')
      .addSelect('tv.veh_placa', 'vehiculo')
      .addSelect('tv.veh_modelo', 'modelo')
      .addSelect('count(tsot)', 'visitas')
      .groupBy('cli.cli_apellidos, cli.cli_nombres, tv.veh_placa')
      .limit(10)
      .getRawMany<{
        cliente: string;
        vehiculo: string;
        modelo: string;
        visitas: string;
      }>();

    return primitiveValues.map(({ cliente, vehiculo, modelo, visitas }) => ({
      cliente,
      vehiculo,
      modelo,
      visitas: Format.formatNumber(+visitas),
    }));
  }

  async getMecanicosConMasServicios(): Promise<
    {
      nombres: string;
      apellidos: string;
      servicios: number;
      codigoEmpleado: number;
      especialidadMecanica: string;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .innerJoinAndSelect('tsot.mecanico', 'm')
      .innerJoinAndSelect('m.especialidadMecanica', 'em')
      .select('m.mec_nombres', 'nombres')
      .addSelect('m.mec_apellidos', 'apellidos')
      .addSelect('count(tsot)', 'servicios')
      .addSelect('m.mec_codigo', 'codigoEmpleado')
      .addSelect('em.eme_nombre', 'especialidadMecanica')
      .groupBy('m.mec_nombres, m.mec_apellidos, m.mec_codigo, em.eme_nombre')
      .limit(10)
      .getRawMany<{
        nombres: string;
        apellidos: string;
        servicios: string;
        codigoEmpleado: string;
        especialidadMecanica: string;
      }>();

    return primitiveValues.map(
      ({
        nombres,
        apellidos,
        servicios,
        codigoEmpleado,
        especialidadMecanica,
      }) => ({
        nombres,
        apellidos,
        servicios: +servicios,
        codigoEmpleado: +codigoEmpleado,
        especialidadMecanica,
      }),
    );
  }

  async getServiciosPrestadosMasMenosCaros(order: 'ASC' | 'DESC'): Promise<
    {
      codigo: string;
      nombre: string;
      descripcion: string;
      costo: string;
      cantidadSolicitudes: string;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .select('s.srv_codigo', 'codigo')
      .addSelect('s.srv_nombre', 'nombre')
      .addSelect('s.srv_descripcion', 'descripcion')
      .addSelect('s.srv_costo', 'costo')
      .addSelect('count(tsot)', 'cantidadSolicitudes')
      .groupBy('s.srv_codigo, s.srv_nombre, s.srv_descripcion, s.srv_costo')
      .orderBy('costo', order)
      .limit(5)
      .getRawMany<{
        codigo: string;
        nombre: string;
        descripcion: string;
        costo: string;
        cantidadSolicitudes: string;
      }>();

    return primitiveValues.map(
      ({ codigo, nombre, descripcion, costo, cantidadSolicitudes }) => ({
        codigo,
        nombre,
        descripcion,
        costo: Format.formatCurrency(+costo),
        cantidadSolicitudes: Format.formatNumber(+cantidadSolicitudes),
      }),
    );
  }

  async getVehiculosMasMenosNuevosReparados(order: 'ASC' | 'DESC'): Promise<
    {
      placa: string;
      marca: string;
      modelo: string;
      vistas: number;
    }[]
  > {
    const primitiveValues = await this.servicioRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.serviciosOrdenTrabajo', 'tsot')
      .innerJoinAndSelect('tsot.ordenTrabajo', 'ot')
      .innerJoinAndSelect('ot.vehiculo', 'v')
      .innerJoinAndSelect('v.marcaVehiculo', 'mv')
      .select('v.veh_placa', 'placa')
      .addSelect('mv.mve_nombre', 'marca')
      .addSelect('v.veh_modelo', 'modelo')
      .addSelect('count(tsot.*)', 'vistas')
      .limit(5)
      .groupBy('v.veh_placa, mv.mve_nombre, v.veh_modelo')
      .orderBy('v.veh_modelo', order)
      .getRawMany<{
        placa: string;
        marca: string;
        modelo: string;
        vistas: string;
      }>();

    return primitiveValues.map(({ placa, marca, modelo, vistas }) => ({
      placa,
      marca,
      modelo,
      vistas: +vistas,
    }));
  }

}
