import { Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { TipoServicio } from '../tipo_servicio/entities/tipo_servicio.entity';
import { TipoServicioModule } from '../tipo_servicio/tipo_servicio.module';

@Module({
  controllers: [ServicioController],
  providers: [ServicioService],
  imports: [
    TypeOrmModule.forFeature([Servicio, TipoServicio]),
    TipoServicioModule,
  ],
})
export class ServicioModule {
}
