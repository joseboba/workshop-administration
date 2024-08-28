import { Module } from '@nestjs/common';
import { MarcaVehiculoService } from './marca_vehiculo.service';
import { MarcaVehiculoController } from './marca_vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaVehiculo } from './entities/marca_vehiculo.entity';

@Module({
  controllers: [MarcaVehiculoController],
  providers: [MarcaVehiculoService],
  imports: [TypeOrmModule.forFeature([MarcaVehiculo])],
})
export class MarcaVehiculoModule {}
