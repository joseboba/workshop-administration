import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrdenTrabajoDto } from './dto/update-orden_trabajo.dto';
import { CitaService } from '../../administration/cita/cita.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { OrdenTrabajo } from '../../administration/orden_trabajo/entities/orden_trabajo.entity';
import { CreateOrdenTrabajoDto } from './dto/create-orden_trabajo.dto';
import { TallerService } from '../../administration/taller/taller.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDesperfectoOrdenTrabajoDto } from './dto/update_desperfecto_orden_trabajo.dto';
import { DesperfectoOrdenTrabajo } from '../../administration/desperfecto_orden_trabajo/desperfecto_orden_trabajo.entity';
import { OrdenTrabajoPaginationFilterDto } from './dto/orden-trabajo-pagination-filter.dto';
import {
  camelToSnakeCase,
  convertToLikeParameter,
  transformToAscOrDesc,
} from '../../util';
import { PaginationResponseDto } from '../../commons';
import moment from 'moment';
import { MailerService } from '@nestjs-modules/mailer';
import { VehiculoService } from '../../administration/vehiculo/vehiculo.service';

/*
  CANCELADA,
  CREADO,
  EN_PROCESO,
  TERMINADO,
  PAGADO
*/

@Injectable()
export class OrdenTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,
    @InjectRepository(DesperfectoOrdenTrabajo)
    private readonly desperfectoOrdenTrabajoRepository: Repository<DesperfectoOrdenTrabajo>,
    private readonly citaService: CitaService,
    private readonly tallerService: TallerService,
    private readonly dataSource: DataSource,
    private readonly mailService: MailerService,
    private readonly vehiculoService: VehiculoService,
  ) {}

  async create(
    createOrdenTrabajoDto: CreateOrdenTrabajoDto,
  ): Promise<OrdenTrabajo> {
    const cita = await this.citaService.findOne(
      createOrdenTrabajoDto.ctaCodigo,
    );
    const taller = await this.tallerService.findOne(
      createOrdenTrabajoDto.tallCodigo,
    );
    let entity = new OrdenTrabajo();
    let queryRunner: QueryRunner;

    entity.ortFechaInicio = new Date();
    entity.ortEstadoPrevio = createOrdenTrabajoDto.detalleEstadoPrevio;
    entity.ortFechaEntrega = createOrdenTrabajoDto.ortFechaEntrega;
    entity.ortDiasGarantia = createOrdenTrabajoDto.diasGarantia;
    entity.taller = taller;
    entity.vehiculo = cita.vehiculo;
    entity.cita = cita;
    entity.ortStatus = 'CREADO';

    const ordenTrabajo = await this.ordenTrabajoRepository.findOneBy({
      cita,
    });

    if (ordenTrabajo) {
      throw new BadRequestException(
        'La cita ya tiene asociada una orden de trabajo',
      );
    }

    this.validateFechaEntrega(createOrdenTrabajoDto.ortFechaEntrega);

    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      entity = await queryRunner.manager.save(entity);
      await this.citaService.updateStatus(createOrdenTrabajoDto.ctaCodigo);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    const vehiculo = await this.vehiculoService.findOne(cita.vehiculo.vehPlaca);
    await this.mailService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `Hola! ${vehiculo.cliente.cliNombres}, Orden #${entity.ortCodigo}`,
      html: `<body>
        <h1 style="font-weight: normal"> La orden fue creada para el vehículo <b>${vehiculo.vehPlaca}</b> </h1>
        <h1 style="font-weight: normal"> Se te estará notificando de nuevos desperfectos encontrados! </h1>
       </body>`,
    });
    return entity;
  }

  private validateFechaEntrega(fechaEntrega: Date) {
    const now = moment().startOf('day');
    const parseFechaEntrega = moment(fechaEntrega).startOf('day');

    if (now.isAfter(parseFechaEntrega) || now.isSame(parseFechaEntrega)) {
      throw new BadRequestException('La fecha de entrega no es válida');
    }
  }

  async findAll(ordenTrabajoPagination: OrdenTrabajoPaginationFilterDto) {
    const {
      size = 10,
      page = 0,
      sort = 'ort_fecha_inicio,desc',
      inicioFechaCreacion = null,
      finFechaCreacion = null,
      placa = '',
      cita = 0,
    } = ordenTrabajoPagination;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      placa: convertToLikeParameter(placa),
      cita,
      inicioFechaCreacion,
      finFechaCreacion,
    };

    let filters = `
      (:placa = '' or ot.veh_placa ilike :placa) AND
      (:cita = 0 or ot.cta_codigo = :cita)
    `;

    if (inicioFechaCreacion && finFechaCreacion) {
      filters += ` AND ot.ort_fecha_inicio BETWEEN :inicioFechaCreacion AND :finFechaCreacion`;
      parameters.inicioFechaCreacion = inicioFechaCreacion;
      parameters.finFechaCreacion = finFechaCreacion;
    }

    const queryBuilder = await this.ordenTrabajoRepository
      .createQueryBuilder('ot')
      .innerJoinAndSelect('ot.vehiculo', 'veh')
      .innerJoinAndSelect('ot.taller', 'tll')
      .innerJoinAndSelect('ot.cita', 'cta');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `ot.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<OrdenTrabajo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(ortCodigo: number): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      relations: [
        'cita',
        'taller',
        'vehiculo',
        'vehiculo.cliente',
        'serviciosOrdenTrabajo',
        'serviciosOrdenTrabajo.servicio',
      ],
      where: {
        ortCodigo,
      },
    });

    if (!ordenTrabajo) {
      throw new BadRequestException(
        `No existe orden de trabajo con el codigo ${ordenTrabajo}`,
      );
    }

    ordenTrabajo.desperfectos =
      await this.desperfectoOrdenTrabajoRepository.findBy({
        ordenTrabajo,
      });
    return ordenTrabajo;
  }

  async update(
    ortCodigo: number,
    updateOrdenTrabajoDto: UpdateOrdenTrabajoDto,
  ) {
    let queryRunner: QueryRunner;
    let entity = new OrdenTrabajo();

    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      entity = await this.findOne(ortCodigo);
      entity.ortEstadoPrevio = updateOrdenTrabajoDto.detalleEstadoPrevio;
      if (updateOrdenTrabajoDto.ortFechaEntrega) {
        this.validateFechaEntrega(updateOrdenTrabajoDto.ortFechaEntrega);
        entity.ortFechaEntrega = updateOrdenTrabajoDto.ortFechaEntrega;
      }
      entity.ortDiasGarantia = updateOrdenTrabajoDto.diasGarantia;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async agregarDesperfecto(
    updateDesperfectoOrdenTrabajoDto: UpdateDesperfectoOrdenTrabajoDto,
  ) {
    const entity = new DesperfectoOrdenTrabajo();
    const ordenTrabajo = await this.findOne(
      updateDesperfectoOrdenTrabajoDto.ortCodigo,
    );
    entity.ordenTrabajo = ordenTrabajo;
    entity.dsorDesperfecto = updateDesperfectoOrdenTrabajoDto.desperfecto;
    await this.desperfectoOrdenTrabajoRepository.save(entity);
    const vehiculo = await this.vehiculoService.findOne(
      ordenTrabajo.vehiculo.vehPlaca,
    );
    await this.mailService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `Nuevo desperfecto encontrado, Orden# ${ordenTrabajo.ortCodigo}`,
      html: `<body>
           <h1 style="font-weight: normal">Se ha encontrado el siguiente desperfecto</h1>
           <hr>
           <h2> ${updateDesperfectoOrdenTrabajoDto.desperfecto} </h2>
      </body>`,
    });
  }

  async remove(ortCodigo: number) {
    const ordenTrabajo = await this.findOne(ortCodigo);
    ordenTrabajo.ortStatus = 'CANCELADO';
    await this.ordenTrabajoRepository.save(ordenTrabajo);
  }

  async getTotal(ortCodigo: number) {
    const primitiveValues = await this.ordenTrabajoRepository
      .createQueryBuilder('toj')
      .innerJoinAndSelect('toj.serviciosOrdenTrabajo', 'tsot')
      .innerJoinAndSelect('tsot.servicio', 'ts')
      .select('sum(ts.srv_costo)', 'servicios')
      .where('toj.ort_codigo = :codigo', { codigo: ortCodigo })
      .getRawOne<{ servicios: string }>();
    return +primitiveValues.servicios;
  }

  async actualizarEstadoOrdenTrabajo(ortCodigo: number, estado: string) {
    const entity = await this.findOne(ortCodigo);
    entity.ortStatus = estado;
    return await this.ordenTrabajoRepository.save(entity);
  }
}
