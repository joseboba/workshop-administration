import { Module } from '@nestjs/common';
import { EquipoTallerService } from './equipo_taller.service';
import { EquipoTallerController } from './equipo_taller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoTaller } from './entities/equipo_taller.entity';
import { MecanicoModule } from '../mecanico/mecanico.module';
import { MarcaEquipoModule } from '../marca_equipo/marca_equipo.module';

@Module({
  controllers: [EquipoTallerController],
  providers: [EquipoTallerService],
  imports: [
    TypeOrmModule.forFeature([EquipoTaller]),
    MecanicoModule,
    MarcaEquipoModule,
  ],
})
export class EquipoTallerModule {}
