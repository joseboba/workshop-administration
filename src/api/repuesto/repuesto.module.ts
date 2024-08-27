import { Module } from '@nestjs/common';
import { RepuestoService } from './repuesto.service';
import { RepuestoController } from './repuesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repuesto } from './entities/repuesto.entity';
import { TipoRepuestoModule } from '../tipo_repuesto/tipo_repuesto.module';
import { ProveedorModule } from '../proveedor/proveedor.module';

@Module({
  controllers: [RepuestoController],
  providers: [RepuestoService],
  imports: [
    TypeOrmModule.forFeature([Repuesto]),
    TipoRepuestoModule,
    ProveedorModule,
  ],
})
export class RepuestoModule {
}
