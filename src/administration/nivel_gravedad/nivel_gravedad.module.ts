import { Module } from '@nestjs/common';
import { NivelGravedadService } from './nivel_gravedad.service';
import { NivelGravedadController } from './nivel_gravedad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelGravedad } from './entities/nivel_gravedad.entity';

@Module({
  controllers: [NivelGravedadController],
  providers: [NivelGravedadService],
  imports: [TypeOrmModule.forFeature([NivelGravedad])]
})
export class NivelGravedadModule {}
