import { Module } from '@nestjs/common';
import { MarcaEquipoService } from './marca_equipo.service';
import { MarcaEquipoController } from './marca_equipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEquipo } from './entities/marca_equipo.entity';

@Module({
  controllers: [MarcaEquipoController],
  providers: [MarcaEquipoService],
  imports: [TypeOrmModule.forFeature([MarcaEquipo])]
})
export class MarcaEquipoModule {}
