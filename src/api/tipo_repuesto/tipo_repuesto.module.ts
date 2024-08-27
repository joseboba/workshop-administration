import { Module } from '@nestjs/common';
import { TipoRepuestoService } from './tipo_repuesto.service';
import { TipoRepuestoController } from './tipo_repuesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoRepuesto } from './entities/tipo_repuesto.entity';

@Module({
  controllers: [TipoRepuestoController],
  providers: [TipoRepuestoService],
  imports: [TypeOrmModule.forFeature([TipoRepuesto])],
  exports: [TipoRepuestoService],
})
export class TipoRepuestoModule {}
