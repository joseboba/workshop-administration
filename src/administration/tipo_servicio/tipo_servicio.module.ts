import { Module } from '@nestjs/common';
import { TipoServicioService } from './tipo_servicio.service';
import { TipoServicioController } from './tipo_servicio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicio } from './entities/tipo_servicio.entity';
import { Servicio } from '../servicio/entities/servicio.entity';

@Module({
  controllers: [TipoServicioController],
  providers: [TipoServicioService],
  imports: [TypeOrmModule.forFeature([TipoServicio, Servicio])],
  exports: [TipoServicioService],
})
export class TipoServicioModule {}
