import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdenTrabajoService } from '../orden_trabajo/orden_trabajo.service';
import { ServicioOrdenTrabajoService } from '../servicio_orden_trabajo/servicio_orden_trabajo.service';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplyPaymentDto } from './dto/apply-payment.dto';
import { TipoPagoService } from '../../administration/tipo_pago/tipo_pago.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Pago)
    private readonly paymentRepository: Repository<Pago>,
    private readonly ordenTrabajoService: OrdenTrabajoService,
    private readonly servicioOrdenTrabajoService: ServicioOrdenTrabajoService,
    private readonly tipoPagoService: TipoPagoService,
  ) {}

  async describeTotal(ortCodigo: number): Promise<{
    servicios: number;
    productos: number;
    repuestos: number;
    total: number;
  }> {
    const servicios = await this.ordenTrabajoService.getTotal(ortCodigo);
    const productos =
      await this.servicioOrdenTrabajoService.getTotalProducts(ortCodigo);
    const repuestos =
      await this.servicioOrdenTrabajoService.getTotalRepuestos(ortCodigo);
    const total = await this.servicioOrdenTrabajoService.getTotal(ortCodigo);

    return {
      servicios,
      productos,
      repuestos,
      total,
    };
  }

  async applyPayment(applyPaymentDto: ApplyPaymentDto) {
    const ordenTrabajo = await this.ordenTrabajoService.findOne(
      applyPaymentDto.ortCodigo,
    );

    const queryBuilder = this.paymentRepository.createQueryBuilder('p');
    const validateTotals = +(
      await queryBuilder
        .select('SUM(p.pag_total)', 'total')
        .where('p.ort_codigo = :ortCodigo', {
          ortCodigo: applyPaymentDto.ortCodigo,
        })
        .getRawOne<{ total: number }>()
    ).total;

    const totalOrder = await this.servicioOrdenTrabajoService.getTotal(
      applyPaymentDto.ortCodigo,
    );

    if (validateTotals + applyPaymentDto.pagTotal > totalOrder) {
      throw new BadRequestException(
        'El pago excede el total de la orden de trabajo',
      );
    }

    const tipoPago = await this.tipoPagoService.findOne(
      applyPaymentDto.tpaCodigo,
    );
    const entity = new Pago();
    entity.ordenTrabajo = ordenTrabajo;
    entity.tipoPago = tipoPago;
    entity.pagFecha = new Date();
    entity.pagReferencia = applyPaymentDto.pagReferencia;
    entity.pagNumeroAutorizacion = applyPaymentDto.pagNumeroAutorizacion;
    entity.pagDocumentoPago = applyPaymentDto.pagDocumentoPago;
    entity.pagTotal = applyPaymentDto.pagTotal;

    await this.paymentRepository.save(entity);

    const sumTotals = +(
      await queryBuilder
        .select('SUM(p.pag_total)', 'total')
        .where('p.ort_codigo = :ortCodigo', {
          ortCodigo: applyPaymentDto.ortCodigo,
        })
        .getRawOne<{ total: number }>()
    ).total;

    if (sumTotals === totalOrder) {
      await this.ordenTrabajoService.actualizarEstadoOrdenTrabajo(
        applyPaymentDto.ortCodigo,
        'PAGADO',
      );
      return;
    }

    await this.ordenTrabajoService.actualizarEstadoOrdenTrabajo(
      applyPaymentDto.ortCodigo,
      'PG_PROCESO',
    );
  }
}
