import { Module } from '@nestjs/common';
import { ServicioRepuestoService } from './servicio_repuesto.service';
import { ServicioRepuestoController } from './servicio_repuesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioRepuesto } from './entities/servicio_repuesto.entity';
import { ServicioModule } from '../servicio/servicio.module';
import { RepuestoModule } from '../repuesto/repuesto.module';

@Module({
  controllers: [ServicioRepuestoController],
  providers: [ServicioRepuestoService],
  imports: [TypeOrmModule.forFeature([ServicioRepuesto]), ServicioModule, RepuestoModule],
})
export class ServicioRepuestoModule {
}
