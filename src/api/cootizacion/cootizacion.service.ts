import { Injectable } from '@nestjs/common';
import { CreateCootizacionDto } from './dto/create-cootizacion.dto';
import { UpdateCootizacionDto } from './dto/update-cootizacion.dto';

@Injectable()
export class CootizacionService {
  create(createCootizacionDto: CreateCootizacionDto) {
    return 'This action adds a new cootizacion';
  }

  findAll() {
    return `This action returns all cootizacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cootizacion`;
  }

  update(id: number, updateCootizacionDto: UpdateCootizacionDto) {
    return `This action updates a #${id} cootizacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} cootizacion`;
  }
}
