import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { TipoVehiculoController } from './tipo_vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoVehiculo } from './entities/tipo_vehiculo.entity';

@Module({
  controllers: [TipoVehiculoController],
  providers: [TipoVehiculoService],
  imports: [TypeOrmModule.forFeature([TipoVehiculo])],
})
export class TipoVehiculoModule {}
