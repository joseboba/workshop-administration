import { Injectable } from '@nestjs/common';
import { CreateServicioProductoDto } from './dto/create-servicio_producto.dto';
import { UpdateServicioProductoDto } from './dto/update-servicio_producto.dto';

@Injectable()
export class ServicioProductoService {
  create(createServicioProductoDto: CreateServicioProductoDto) {
    return 'This action adds a new servicioProducto';
  }

  findAll() {
    return `This action returns all servicioProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servicioProducto`;
  }

  update(id: number, updateServicioProductoDto: UpdateServicioProductoDto) {
    return `This action updates a #${id} servicioProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} servicioProducto`;
  }
}
