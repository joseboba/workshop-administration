import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { ClienteModule } from '../cliente/cliente.module';
import { MarcaVehiculoModule } from '../marca_vehiculo/marca_vehiculo.module';
import { TipoVehiculoModule } from '../tipo_vehiculo/tipo_vehiculo.module';

@Module({
  controllers: [VehiculoController],
  providers: [VehiculoService],
  imports: [
    TypeOrmModule.forFeature([Vehiculo]),
    ClienteModule,
    MarcaVehiculoModule,
    TipoVehiculoModule,
  ],
  exports: [VehiculoService],
})
export class VehiculoModule {}
