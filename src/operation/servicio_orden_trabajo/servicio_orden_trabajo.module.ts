import { Module } from '@nestjs/common';
import { ServicioOrdenTrabajoService } from './servicio_orden_trabajo.service';
import { ServicioOrdenTrabajoController } from './servicio_orden_trabajo.controller';
import { OrdenTrabajoModule } from '../orden_trabajo/orden_trabajo.module';
import {
  MecanicoModule, ProductoModule, RepuestoModule,
  ServicioModule, ServicioProductoModule, ServicioRepuestoModule,
  VehiculoModule,
} from '../../administration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioOrdenTrabajo } from '../../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import { ProductoServicioOrdenTrabajo } from '../../administration/producto_servicio_orden_trabajo/producto_servicio_orden_trabajo.entity';
import { RepuestoServicioOrdenTrabajo } from '../../administration/repuesto_servicio_orden_trabajo/repuesto_servicio_orden_trabajo.entity';

@Module({
  controllers: [ServicioOrdenTrabajoController],
  providers: [ServicioOrdenTrabajoService],
  imports: [
    TypeOrmModule.forFeature([
      ServicioOrdenTrabajo,
      ProductoServicioOrdenTrabajo,
      RepuestoServicioOrdenTrabajo,
    ]),
    OrdenTrabajoModule,
    MecanicoModule,
    ServicioModule,
    VehiculoModule,
    ProductoModule,
    RepuestoModule,
    ServicioProductoModule,
    ServicioRepuestoModule,
  ],
  exports: [ServicioOrdenTrabajoService],
})
export class ServicioOrdenTrabajoModule {}
