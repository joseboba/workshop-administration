import { Module } from '@nestjs/common';
import { HerramientaService } from './herramienta.service';
import { HerramientaController } from './herramienta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Herramienta } from './entities/herramienta.entity';
import { MarcaHerramientaModule } from '../marca_herramienta/marca_herramienta.module';
import { MecanicoModule } from '../mecanico/mecanico.module';

@Module({
  controllers: [HerramientaController],
  providers: [HerramientaService],
  imports: [
    TypeOrmModule.forFeature([Herramienta]),
    MarcaHerramientaModule,
    MecanicoModule,
  ],
})
export class HerramientaModule {}
