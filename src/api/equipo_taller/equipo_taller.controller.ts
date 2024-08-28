import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipoTallerService } from './equipo_taller.service';
import { CreateEquipoTallerDto } from './dto/create-equipo_taller.dto';
import { UpdateEquipoTallerDto } from './dto/update-equipo_taller.dto';

@Controller('equipo-taller')
export class EquipoTallerController {
  constructor(private readonly equipoTallerService: EquipoTallerService) {}

  @Post()
  create(@Body() createEquipoTallerDto: CreateEquipoTallerDto) {
    return this.equipoTallerService.create(createEquipoTallerDto);
  }

  @Get()
  findAll() {
    return this.equipoTallerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipoTallerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipoTallerDto: UpdateEquipoTallerDto) {
    return this.equipoTallerService.update(+id, updateEquipoTallerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipoTallerService.remove(+id);
  }
}
