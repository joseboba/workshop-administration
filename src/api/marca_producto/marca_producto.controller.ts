import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaProductoService } from './marca_producto.service';
import { CreateMarcaProductoDto } from './dto/create-marca_producto.dto';
import { UpdateMarcaProductoDto } from './dto/update-marca_producto.dto';

@Controller('marca-producto')
export class MarcaProductoController {
  constructor(private readonly marcaProductoService: MarcaProductoService) {}

  @Post()
  create(@Body() createMarcaProductoDto: CreateMarcaProductoDto) {
    return this.marcaProductoService.create(createMarcaProductoDto);
  }

  @Get()
  findAll() {
    return this.marcaProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaProductoDto: UpdateMarcaProductoDto) {
    return this.marcaProductoService.update(+id, updateMarcaProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaProductoService.remove(+id);
  }
}
