import { Module } from '@nestjs/common';
import { DiasNoDisponiblesService } from './dias_no_disponibles.service';
import { DiasNoDisponiblesController } from './dias_no_disponibles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiasNoDisponible } from './entities/dias_no_disponible.entity';
import { TallerModule } from '../taller/taller.module';

@Module({
  controllers: [DiasNoDisponiblesController],
  providers: [DiasNoDisponiblesService],
  imports: [TypeOrmModule.forFeature([DiasNoDisponible]), TallerModule],
})
export class DiasNoDisponiblesModule {
}
