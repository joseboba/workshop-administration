import { Module } from '@nestjs/common';
import { OrdenTrabajoService } from './orden_trabajo.service';
import { OrdenTrabajoController } from './orden_trabajo.controller';
import { CitaModule, TallerModule, VehiculoModule } from '../../administration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from '../../administration/orden_trabajo/entities/orden_trabajo.entity';
import {
  DesperfectoOrdenTrabajo,
} from '../../administration/desperfecto_orden_trabajo/desperfecto_orden_trabajo.entity';

@Module({
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
  imports: [
    TypeOrmModule.forFeature([OrdenTrabajo, DesperfectoOrdenTrabajo]),
    CitaModule,
    TallerModule,
    VehiculoModule,
  ],
  exports: [OrdenTrabajoService],
})
export class OrdenTrabajoModule {
}
