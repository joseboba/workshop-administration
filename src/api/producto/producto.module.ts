import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { MarcaProductoModule } from '../marca_producto/marca_producto.module';
import { ProveedorModule } from '../proveedor/proveedor.module';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService],
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MarcaProductoModule,
    ProveedorModule,
  ],
})
export class ProductoModule {}
