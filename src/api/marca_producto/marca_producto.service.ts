import { Injectable } from '@nestjs/common';
import { CreateMarcaProductoDto } from './dto/create-marca_producto.dto';
import { UpdateMarcaProductoDto } from './dto/update-marca_producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaVehiculo } from '../marca_vehiculo/entities/marca_vehiculo.entity';
import { DataSource, Repository } from 'typeorm';
import { MarcaProducto } from './entities/marca_producto.entity';

@Injectable()
export class MarcaProductoService {
  // constructor(
  //   @InjectRepository(MarcaProducto)
  //   private readonly marcaProductoRepository: Repository<MarcaProducto>,
  //   private readonly dataSource: DataSource,
  // ) {}
  create(createMarcaProductoDto: CreateMarcaProductoDto) {
    return 'This action adds a new marcaProducto';
  }

  findAll() {
    return `This action returns all marcaProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marcaProducto`;
  }

  update(id: number, updateMarcaProductoDto: UpdateMarcaProductoDto) {
    return `This action updates a #${id} marcaProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} marcaProducto`;
  }
}
