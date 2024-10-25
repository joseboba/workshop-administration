import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServicioOrdenTrabajoDto } from './dto/create-servicio_orden_trabajo.dto';
import { UpdateServicioOrdenTrabajoDto } from './dto/update-servicio_orden_trabajo.dto';
import { OrdenTrabajoService } from '../orden_trabajo/orden_trabajo.service';
import { MecanicoService } from '../../administration/mecanico/mecanico.service';
import { ServicioService } from '../../administration/servicio/servicio.service';
import { ServicioOrdenTrabajo } from '../../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import moment from 'moment/moment';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { VehiculoService } from '../../administration/vehiculo/vehiculo.service';
import { camelToSnakeCase, Format, transformToAscOrDesc } from '../../util';
import { ProductoServicioOrdenTrabajo } from '../../administration/producto_servicio_orden_trabajo/producto_servicio_orden_trabajo.entity';
import { RepuestoServicioOrdenTrabajo } from '../../administration/repuesto_servicio_orden_trabajo/repuesto_servicio_orden_trabajo.entity';
import { ProductoService } from '../../administration/producto/producto.service';
import { RepuestoService } from '../../administration/repuesto/repuesto.service';
import { ServicioRepuestoService } from '../../administration/servicio_repuesto/servicio_repuesto.service';
import { ServicioProductoService } from '../../administration/servicio_producto/servicio_producto.service';
import { Producto } from '../../administration/producto/entities/producto.entity';
import { Repuesto } from '../../administration/repuesto/entities/repuesto.entity';
import { PaginationResponseDto } from '../../commons';
import { ServicioOrdenTrabajoPaginationFilterDto } from './dto/servicio-orden-trabajo-pagination-filter.dto';

@Injectable()
export class ServicioOrdenTrabajoService {
  constructor(
    @InjectRepository(ServicioOrdenTrabajo)
    private readonly servicioOrdenTrabajoRepository: Repository<ServicioOrdenTrabajo>,
    @InjectRepository(ProductoServicioOrdenTrabajo)
    private readonly productoServicioOrdenTrabajoRepository: Repository<ProductoServicioOrdenTrabajo>,
    @InjectRepository(RepuestoServicioOrdenTrabajo)
    private readonly repuestoServicioOrdenTrabajoRepository: Repository<RepuestoServicioOrdenTrabajo>,
    private readonly ordenTrabajoService: OrdenTrabajoService,
    private readonly mecanicoService: MecanicoService,
    private readonly servicioService: ServicioService,
    private readonly vehiculoService: VehiculoService,
    private readonly productoService: ProductoService,
    private readonly dataSource: DataSource,
    private readonly mailerService: MailerService,
    private readonly repuestoService: RepuestoService,
    private readonly servicioRepuestoService: ServicioRepuestoService,
    private readonly servicioProductoService: ServicioProductoService,
  ) {}

  async create(
    createServicioOrdenTrabajoDto: CreateServicioOrdenTrabajoDto,
  ): Promise<ServicioOrdenTrabajo> {
    let entity = new ServicioOrdenTrabajo();
    const ordenTrabajo = await this.ordenTrabajoService.findOne(
      createServicioOrdenTrabajoDto.ortCodigo,
    );

    if (ordenTrabajo.ortStatus === 'TERMINADA') {
      throw new BadRequestException('La orden de trabajo ya fue terminada');
    }
    const mecanico = await this.mecanicoService.findOne(
      createServicioOrdenTrabajoDto.mecCodigo,
    );
    const servicio = await this.servicioService.findOne(
      createServicioOrdenTrabajoDto.srvCodigo,
    );

    this.validateFechaEntrega(createServicioOrdenTrabajoDto.fechaEntrega);

    if (
      createServicioOrdenTrabajoDto.diasGarantia > ordenTrabajo.ortDiasGarantia
    ) {
      throw new BadRequestException(
        'No se pueden dar más días de garantía de lo que permite la orden de trabajo',
      );
    }

    const servicioOrdenTrabajo =
      await this.servicioOrdenTrabajoRepository.findOneBy({
        servicio,
        ordenTrabajo,
      });

    if (servicioOrdenTrabajo) {
      throw new BadRequestException(
        `Ya existe este servicio asociado a la orden de trabajo No. ${ordenTrabajo.ortCodigo}`,
      );
    }

    entity.sorFechaServicio = new Date();
    entity.sorEstadoServicio = 'CREADO';
    entity.sorFechaEntrega = createServicioOrdenTrabajoDto.fechaEntrega;
    entity.sorDiasGarantia = createServicioOrdenTrabajoDto.diasGarantia;
    entity.servicio = servicio;
    entity.ordenTrabajo = ordenTrabajo;
    entity.mecanico = mecanico;
    entity.sorDetalleEstadoPrevio = createServicioOrdenTrabajoDto.estadoPrevio;

    let queryRunner: QueryRunner;
    try {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      entity = await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    const vehiculo = await this.vehiculoService.findOne(
      ordenTrabajo.vehiculo.vehPlaca,
    );

    await this.ordenTrabajoService.actualizarEstadoOrdenTrabajo(
      ordenTrabajo.ortCodigo,
      'EN_PROCESO',
    );
    await this.mailerService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `Se a agregado un nuevo servicio a su orden de trabajo No. ${ordenTrabajo.ortCodigo}`,
      html: `
        <body>
          <h1 style="font-weight: normal">Se a agregado un nuevo servicio a su orden de trabajo</h1>
          <hr>
          <li><strong>Servicio: </strong>${servicio.srvNombre}</li>
          <li><strong>Costo servicio: </strong>${Format.formatCurrency(servicio.srvCosto)}</li>
          <li><strong>Mecanico: </strong>${mecanico.mecNombres} ${mecanico.mecApellidos}</li>
        </body>
      `,
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

  async agergarProducto(
    sorCodigo: number,
    proCodigo: number,
    cantidad: number,
  ) {
    if (cantidad < 0) {
      throw new BadRequestException('La cantidad debe de ser mayor a 0');
    }
    const producto = await this.productoService.findOne(proCodigo);
    if (producto.proCantidadDisponible < cantidad) {
      throw new BadRequestException(
        'El producto no tiene suficiente inventario',
      );
    }

    let entity = await this.productoServicioOrdenTrabajoRepository.findOneBy({
      sorCodigo,
      proCodigo,
    });

    if (!entity) {
      entity = new ProductoServicioOrdenTrabajo();
      entity.proCodigo = proCodigo;
      entity.sorCodigo = sorCodigo;
      entity.cantidad = cantidad;
    } else {
      entity.cantidad += cantidad;
    }

    entity.fecha = new Date();

    await this.productoServicioOrdenTrabajoRepository.save(entity);
    await this.productoService.descontarProducto(proCodigo, cantidad);

    const servicioOrdenTrabajo = await this.findOne(sorCodigo);
    const vehiculo = await this.vehiculoService.findOne(
      servicioOrdenTrabajo.ordenTrabajo.vehiculo.vehPlaca,
    );
    await this.mailerService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `Se ha agregado un nuevo producto a su orden de trabajo No. ${servicioOrdenTrabajo.ordenTrabajo.ortCodigo}`,
      html: `
        <body>
          <h1 style="font-weight: normal">Se a agregado un nuevo producto a su orden de trabajo</h1>
          <hr>
          <li><strong>Producto: </strong>${producto.proNombre}</li>
          <li><strong>Cantidad solicitada: </strong>${Format.formatNumber(cantidad)}</li>
          <li><strong>Costo producto: </strong>${Format.formatCurrency(producto.proPrecioCompra)}</li>
          <li><strong>Total: </strong>${Format.formatCurrency(producto.proPrecioCompra * cantidad)}</li>
        </body>
      `,
    });
  }

  async agregarRepuesto(
    sorCodigo: number,
    repCodigo: number,
    cantidad: number,
  ) {
    if (cantidad < 0) {
      throw new BadRequestException('La cantidad debe de ser mayor a 0');
    }

    const repuesto = await this.repuestoService.findOne(repCodigo);
    if (repuesto.repCantidadDisponible < cantidad) {
      throw new BadRequestException(
        'El repuesto no tiene suficiente inventario',
      );
    }

    let entity = await this.repuestoServicioOrdenTrabajoRepository.findOneBy({
      sorCodigo,
      repCodigo,
    });
    if (!entity) {
      entity = new RepuestoServicioOrdenTrabajo();
      entity.sorCodigo = sorCodigo;
      entity.repCodigo = repCodigo;
      entity.cantidad = cantidad;
    } else {
      entity.cantidad += cantidad;
    }

    entity.fecha = new Date();

    await this.repuestoServicioOrdenTrabajoRepository.save(entity);
    await this.repuestoService.descontarRepuesto(repCodigo, cantidad);

    const servicioOrdenTrabajo = await this.findOne(sorCodigo);
    const vehiculo = await this.vehiculoService.findOne(
      servicioOrdenTrabajo.ordenTrabajo.vehiculo.vehPlaca,
    );
    await this.mailerService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `Se ha agregado un nuevo repuesto a su orden de trabajo No. ${servicioOrdenTrabajo.ordenTrabajo.ortCodigo}`,
      html: `
        <body>
          <h1 style="font-weight: normal">Se a agregado un nuevo producto a su orden de trabajo</h1>
          <hr>
          <li><strong>Repuesto: </strong>${repuesto.repNombre}</li>
          <li><strong>Cantidad solicitada: </strong>${Format.formatNumber(cantidad)}</li>
          <li><strong>Costo repuesto: </strong>${Format.formatCurrency(repuesto.repPrecio)}</li>
          <li><strong>Total: </strong>${Format.formatCurrency(repuesto.repPrecio * cantidad)}</li>
        </body>
      `,
    });
  }

  async findAll(
    servicioOrdenTrabajoPaginationFilterDto: ServicioOrdenTrabajoPaginationFilterDto,
  ) {
    const {
      size = 10,
      page = 0,
      sort = 'sor_fecha_servicio,desc',
      inicioFechaServicio = null,
      finFechaServicio = null,
      srvCodigo = 0,
      ortCodigo = 0,
      mecCodigo = 0,
    } = servicioOrdenTrabajoPaginationFilterDto;

    const splitSortValues = sort.split(',');
    const skip = page * size;
    const parameters = {
      inicioFechaServicio,
      finFechaServicio,
      srvCodigo,
      ortCodigo,
      mecCodigo,
    };

    let filters = `
      (:srvCodigo = 0 or sot.srv_codigo = :srvCodigo) AND
      (:ortCodigo = 0 or sot.ort_codigo = :ortCodigo) AND
      (:mecCodigo = 0 or sot.mec_codigo = :mecCodigo)
    `;

    if (inicioFechaServicio && finFechaServicio) {
      filters += ` AND sot.sor_fecha_servicio BETWEEN :inicioFechaServicio AND :finFechaServicio`;
      parameters.inicioFechaServicio = inicioFechaServicio;
      parameters.finFechaServicio = finFechaServicio;
    }

    const queryBuilder = await this.servicioOrdenTrabajoRepository
      .createQueryBuilder('sot')
      .innerJoinAndSelect('sot.servicio', 's')
      .innerJoinAndSelect('sot.ordenTrabajo', 'ot')
      .innerJoinAndSelect('sot.mecanico', 'mecanico');

    const content = await queryBuilder
      .where(filters, parameters)
      .orderBy(
        `sot.${camelToSnakeCase(splitSortValues[0])}`,
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
    const response = new PaginationResponseDto<ServicioOrdenTrabajo>();
    response.content = content;
    response.totalElements = totalElements;
    response.totalPages = totalPages;
    response.firstPage = page === 0;
    response.lastPage = page === totalPages - 1;
    return response;
  }

  async findOne(sorCodigo: number): Promise<ServicioOrdenTrabajo> {
    const servicioOrdenTrabajo =
      await this.servicioOrdenTrabajoRepository.findOne({
        relations: [
          'ordenTrabajo',
          'mecanico',
          'servicio',
          'ordenTrabajo.vehiculo',
        ],
        where: {
          sorCodigo,
        },
      });

    if (!servicioOrdenTrabajo) {
      throw new BadRequestException(
        `No existe servicio orden de trabajo con el codigo ${servicioOrdenTrabajo.sorCodigo}`,
      );
    }

    servicioOrdenTrabajo.productos =
      await this.productoServicioOrdenTrabajoRepository
        .createQueryBuilder('psot')
        .innerJoin(Producto, 'p', 'psot.pro_codigo = p.pro_codigo')
        .select('psot.pro_codigo', 'proCodigo')
        .addSelect('psot.sor_codigo', 'sorCodigo')
        .addSelect('psot.cantidad', 'cantidad')
        .addSelect('psot.fecha', 'fecha')
        .addSelect('p.pro_nombre', 'proNombre')
        .addSelect('p.pro_precio_compra', 'proPrecio')
        .where('psot.sor_codigo = :sorCodigo', { sorCodigo })
        .getRawMany<ProductoServicioOrdenTrabajo>();

    servicioOrdenTrabajo.productos = servicioOrdenTrabajo.productos.map(
      (item) => ({
        ...item,
        proPrecio: +item.proPrecio,
      }),
    );

    servicioOrdenTrabajo.repuestos =
      await this.repuestoServicioOrdenTrabajoRepository
        .createQueryBuilder('rsot')
        .innerJoin(Repuesto, 'r', 'rsot.rep_codigo = r.rep_codigo')
        .select('rsot.rep_codigo', 'repCodigo')
        .addSelect('rsot.sor_codigo', 'sorCodigo')
        .addSelect('rsot.cantidad', 'cantidad')
        .addSelect('rsot.fecha', 'fecha')
        .addSelect('r.rep_nombre', 'repNombre')
        .addSelect('r.rep_precio', 'repPrecio')
        .where('rsot.sor_codigo = :sorCodigo', { sorCodigo })
        .getRawMany<RepuestoServicioOrdenTrabajo>();

    servicioOrdenTrabajo.repuestos = servicioOrdenTrabajo.repuestos.map(
      (item) => ({
        ...item,
        repPrecio: +item.repPrecio,
      }),
    );

    return servicioOrdenTrabajo;
  }

  async update(
    sorCodigo: number,
    updateServicioOrdenTrabajoDto: UpdateServicioOrdenTrabajoDto,
  ) {
    let queryRunner: QueryRunner;
    let entity = new ServicioOrdenTrabajo();

    try {
      queryRunner = await this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      entity = await this.findOne(sorCodigo);
      entity.sorDetalleEstadoPrevio =
        updateServicioOrdenTrabajoDto.detalleEstadoPrevio;
      if (updateServicioOrdenTrabajoDto.ortFechaEntrega) {
        this.validateFechaEntrega(
          updateServicioOrdenTrabajoDto.ortFechaEntrega,
        );
        entity.sorFechaEntrega = updateServicioOrdenTrabajoDto.ortFechaEntrega;
      }
      entity.sorDiasGarantia = updateServicioOrdenTrabajoDto.diasGarantia;
      await queryRunner.manager.save(entity);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner!.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async terminarServicioOrdenTrabajo(sorCodigo: number) {
    const servicioOrdenTrabajo = await this.findOne(sorCodigo);
    servicioOrdenTrabajo.sorEstadoServicio = 'TERMINADA';
    await this.servicioOrdenTrabajoRepository.save(servicioOrdenTrabajo);

    const cantidadServicioOrdenTrabajoPorOrdenDeTrabajo =
      await this.servicioOrdenTrabajoRepository.countBy({
        ordenTrabajo: servicioOrdenTrabajo.ordenTrabajo,
      });

    const cantidadServicioOrdenTrabajoTerminada =
      await this.servicioOrdenTrabajoRepository.countBy({
        ordenTrabajo: servicioOrdenTrabajo.ordenTrabajo,
        sorEstadoServicio: 'TERMINADA',
      });

    if (
      cantidadServicioOrdenTrabajoPorOrdenDeTrabajo !==
      cantidadServicioOrdenTrabajoTerminada
    ) {
      return;
    }

    await this.ordenTrabajoService.actualizarEstadoOrdenTrabajo(
      servicioOrdenTrabajo.ordenTrabajo.ortCodigo,
      'TERMINADA',
    );

    const vehiculo = await this.vehiculoService.findOne(
      servicioOrdenTrabajo.ordenTrabajo.vehiculo.vehPlaca,
    );

    const total = await this.getTotal(
      servicioOrdenTrabajo.ordenTrabajo.ortCodigo,
    );
    await this.mailerService.sendMail({
      to: vehiculo.cliente.cliCorreo,
      subject: `La Orden de trabajo No. ${servicioOrdenTrabajo.ordenTrabajo.ortCodigo}`,
      html: `<body>
      <h4>¡Felicidades! Tu vehichulo <strong>${vehiculo.vehPlaca}</strong> ha terminado su orden de trabajo</h4>
      <p>
        El total de tu orden de trabajo es <strong>${Format.formatCurrency(total)}</strong>, puedes cancelar tu orden dentro del portal
      </p>
    </body>`,
    });
  }

  async getTotal(ortCodigo: number) {
    const serviciosTotal = await this.ordenTrabajoService.getTotal(ortCodigo);
    const totalProductos = await this.getTotalProducts(ortCodigo);
    const totalRepuestos = await this.getTotalRepuestos(ortCodigo);

    return serviciosTotal + totalProductos + totalRepuestos;
  }

  async getTotalProducts(ortCodigo: number): Promise<number> {
    return +(
      await this.servicioOrdenTrabajoRepository
        .createQueryBuilder('tsot')
        .innerJoin(
          ProductoServicioOrdenTrabajo,
          'tpsot',
          'tpsot.sor_codigo = tsot.sor_codigo',
        )
        .innerJoin(Producto, 'tp', 'tp.pro_codigo = tpsot.pro_codigo')
        .select(
          'COALESCE(SUM(tp.pro_precio_compra * tpsot.cantidad), 0)',
          'totalProducts',
        )
        .where('tsot.ort_codigo = :codigo', { codigo: ortCodigo })
        .getRawOne<{ totalProducts: number }>()
    ).totalProducts;
  }

  async getTotalRepuestos(ortCodigo: number) {
    return +(
      await this.servicioOrdenTrabajoRepository
        .createQueryBuilder('tsot')
        .innerJoin(
          RepuestoServicioOrdenTrabajo,
          'trsot',
          'tsot.SOR_CODIGO = trsot.sor_codigo',
        )
        .innerJoin(Repuesto, 'tr', 'trsot.rep_codigo = tr.rep_codigo')
        .select(
          'COALESCE(SUM(tr.rep_precio * trsot.cantidad), 0)',
          'totalRepuestos',
        )
        .where('tsot.ort_codigo = :codigo', { codigo: ortCodigo })
        .getRawOne<{ totalRepuestos: number }>()
    ).totalRepuestos;
  }

  async remove(sorCodigo: number) {
    const servicioOrdenTrabajo = await this.findOne(sorCodigo);
    servicioOrdenTrabajo.sorEstadoServicio = 'CANCELADO';
    await this.servicioOrdenTrabajoRepository.save(servicioOrdenTrabajo);
  }
}
