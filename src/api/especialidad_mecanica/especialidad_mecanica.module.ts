import { Module } from '@nestjs/common';
import { EspecialidadMecanicaService } from './especialidad_mecanica.service';
import { EspecialidadMecanicaController } from './especialidad_mecanica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadMecanica } from './entities/especialidad_mecanica.entity';

@Module({
  controllers: [EspecialidadMecanicaController],
  providers: [EspecialidadMecanicaService],
  imports: [TypeOrmModule.forFeature([EspecialidadMecanica])],
  exports: [EspecialidadMecanicaService]
})
export class EspecialidadMecanicaModule {}
