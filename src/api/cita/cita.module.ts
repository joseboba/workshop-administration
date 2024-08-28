import { Module } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { VehiculoModule } from '../vehiculo/vehiculo.module';

@Module({
  controllers: [CitaController],
  providers: [CitaService],
  imports: [TypeOrmModule.forFeature([Cita]), VehiculoModule],
})
export class CitaModule {
}
