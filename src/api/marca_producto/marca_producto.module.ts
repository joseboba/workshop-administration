import { Module } from '@nestjs/common';
import { MarcaProductoService } from './marca_producto.service';
import { MarcaProductoController } from './marca_producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaProducto } from './entities/marca_producto.entity';

@Module({
  controllers: [MarcaProductoController],
  providers: [MarcaProductoService],
  // imports: [TypeOrmModule.forFeature([MarcaProducto])],
})
export class MarcaProductoModule {}
