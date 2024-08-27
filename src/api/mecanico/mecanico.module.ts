import { Module } from '@nestjs/common';
import { MecanicoService } from './mecanico.service';
import { MecanicoController } from './mecanico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mecanico } from './entities/mecanico.entity';
import { EspecialidadMecanicaModule } from '../especialidad_mecanica/especialidad_mecanica.module';

@Module({
  controllers: [MecanicoController],
  providers: [MecanicoService],
  imports: [TypeOrmModule.forFeature([Mecanico]), EspecialidadMecanicaModule],
})
export class MecanicoModule {
}
