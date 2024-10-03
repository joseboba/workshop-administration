import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';

@Module({
  controllers: [ProveedorController],
  providers: [ProveedorService],
  imports: [TypeOrmModule.forFeature([Proveedor])],
  exports: [ProveedorService],
})
export class ProveedorModule {}
