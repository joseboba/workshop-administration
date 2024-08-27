import { Injectable } from '@nestjs/common';
import { CreateMecanicoDto } from './dto/create-mecanico.dto';
import { UpdateMecanicoDto } from './dto/update-mecanico.dto';

@Injectable()
export class MecanicoService {
  create(createMecanicoDto: CreateMecanicoDto) {
    return 'This action adds a new mecanico';
  }

  findAll() {
    return `This action returns all mecanico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mecanico`;
  }

  update(id: number, updateMecanicoDto: UpdateMecanicoDto) {
    return `This action updates a #${id} mecanico`;
  }

  remove(id: number) {
    return `This action removes a #${id} mecanico`;
  }
}
