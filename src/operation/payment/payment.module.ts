import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from '../../administration/orden_trabajo/entities/orden_trabajo.entity';
import {
  ServicioOrdenTrabajo,
} from '../../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import { OrdenTrabajoModule } from '../orden_trabajo/orden_trabajo.module';
import { ServicioOrdenTrabajoModule } from '../servicio_orden_trabajo/servicio_orden_trabajo.module';
import { Pago } from './entities/pago.entity';
import { TipoPagoModule } from '../../administration';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([Pago, OrdenTrabajo, ServicioOrdenTrabajo]),
    OrdenTrabajoModule,
    ServicioOrdenTrabajoModule,
    TipoPagoModule,
  ],
})
export class PaymentModule {
}
