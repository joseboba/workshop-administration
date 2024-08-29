import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ServicioProductoService } from './servicio_producto.service';
import { CreateServicioProductoDto } from './dto/create-servicio_producto.dto';
import { UpdateServicioProductoDto } from './dto/update-servicio_producto.dto';
import { ServicioProductoPaginationFiltersDto } from './dto/servicio-producto-pagination-filters.dto';

@Controller('servicio-producto')
export class ServicioProductoController {
  constructor(
    private readonly servicioProductoService: ServicioProductoService,
  ) {}

  @Post()
  create(@Body() createServicioProductoDto: CreateServicioProductoDto) {
    return this.servicioProductoService.create(createServicioProductoDto);
  }

  @Get()
  findAll(
    @Query()
    servicioProductoPaginationFilter: ServicioProductoPaginationFiltersDto,
  ) {
    return this.servicioProductoService.findAll(
      servicioProductoPaginationFilter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicioProductoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServicioProductoDto: UpdateServicioProductoDto,
  ) {
    return this.servicioProductoService.update(+id, updateServicioProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicioProductoService.remove(+id);
  }
}
