import { Module } from '@nestjs/common';
import { ServicioProductoService } from './servicio_producto.service';
import { ServicioProductoController } from './servicio_producto.controller';

@Module({
  controllers: [ServicioProductoController],
  providers: [ServicioProductoService],
})
export class ServicioProductoModule {}
