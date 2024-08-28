import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CootizacionService } from './cootizacion.service';
import { CreateCootizacionDto } from './dto/create-cootizacion.dto';
import { UpdateCootizacionDto } from './dto/update-cootizacion.dto';

@Controller('cootizacion')
export class CootizacionController {
  constructor(private readonly cootizacionService: CootizacionService) {}

  @Post()
  create(@Body() createCootizacionDto: CreateCootizacionDto) {
    return this.cootizacionService.create(createCootizacionDto);
  }

  @Get()
  findAll() {
    return this.cootizacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cootizacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCootizacionDto: UpdateCootizacionDto) {
    return this.cootizacionService.update(+id, updateCootizacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cootizacionService.remove(+id);
  }
}
