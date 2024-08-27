import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MecanicoService } from './mecanico.service';
import { CreateMecanicoDto } from './dto/create-mecanico.dto';
import { UpdateMecanicoDto } from './dto/update-mecanico.dto';

@Controller('mecanico')
export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {}

  @Post()
  create(@Body() createMecanicoDto: CreateMecanicoDto) {
    return this.mecanicoService.create(createMecanicoDto);
  }

  @Get()
  findAll() {
    return this.mecanicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mecanicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMecanicoDto: UpdateMecanicoDto) {
    return this.mecanicoService.update(+id, updateMecanicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mecanicoService.remove(+id);
  }
}
