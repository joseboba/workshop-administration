import { Injectable } from '@nestjs/common';
import { CreateEquipoTallerDto } from './dto/create-equipo_taller.dto';
import { UpdateEquipoTallerDto } from './dto/update-equipo_taller.dto';

@Injectable()
export class EquipoTallerService {
  create(createEquipoTallerDto: CreateEquipoTallerDto) {
    return 'This action adds a new equipoTaller';
  }

  findAll() {
    return `This action returns all equipoTaller`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipoTaller`;
  }

  update(id: number, updateEquipoTallerDto: UpdateEquipoTallerDto) {
    return `This action updates a #${id} equipoTaller`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipoTaller`;
  }
}
