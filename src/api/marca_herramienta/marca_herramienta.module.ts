import { Module } from '@nestjs/common';
import { MarcaHerramientaService } from './marca_herramienta.service';
import { MarcaHerramientaController } from './marca_herramienta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaHerramienta } from './entities/marca_herramienta.entity';

@Module({
  controllers: [MarcaHerramientaController],
  providers: [MarcaHerramientaService],
  imports: [TypeOrmModule.forFeature([MarcaHerramienta])]
})
export class MarcaHerramientaModule {}
