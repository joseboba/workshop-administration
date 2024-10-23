import { Module } from '@nestjs/common';
import { ServicioProductoService } from './servicio_producto.service';
import { ServicioProductoController } from './servicio_producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicioProducto } from './entities/servicio_producto.entity';
import { ServicioModule } from '../servicio/servicio.module';
import { ProductoModule } from '../producto/producto.module';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  controllers: [ServicioProductoController],
  providers: [ServicioProductoService],
  imports: [
    TypeOrmModule.forFeature([ServicioProducto, Producto]),
    ServicioModule,
    ProductoModule,
  ],
  exports: [ServicioProductoService],
})
export class ServicioProductoModule {}
