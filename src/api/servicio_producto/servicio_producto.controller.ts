import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicioProductoService } from './servicio_producto.service';
import { CreateServicioProductoDto } from './dto/create-servicio_producto.dto';
import { UpdateServicioProductoDto } from './dto/update-servicio_producto.dto';

@Controller('servicio-producto')
export class ServicioProductoController {
  constructor(private readonly servicioProductoService: ServicioProductoService) {}

  @Post()
  create(@Body() createServicioProductoDto: CreateServicioProductoDto) {
    return this.servicioProductoService.create(createServicioProductoDto);
  }

  @Get()
  findAll() {
    return this.servicioProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioProductoDto: UpdateServicioProductoDto) {
    return this.servicioProductoService.update(+id, updateServicioProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioProductoService.remove(+id);
  }
}
