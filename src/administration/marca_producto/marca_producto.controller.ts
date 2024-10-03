import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, HttpStatus } from '@nestjs/common';
import { MarcaProductoService } from './marca_producto.service';
import { CreateMarcaProductoDto } from './dto/create-marca_producto.dto';
import { UpdateMarcaProductoDto } from './dto/update-marca_producto.dto';
import { MarcaProductoPaginationFiltersDto } from './dto/marca-producto-pagination-filters.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarcaProducto } from './entities/marca_producto.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { PaginationResponseDto } from '../../commons';

@Controller('marca-producto')
@ApiTags('Marca Producto')
@ApiExtraModels(PaginationResponseDto, MarcaProducto)
export class MarcaProductoController {
  constructor(private readonly marcaProductoService: MarcaProductoService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MarcaProducto,
  })
  create(@Body() createMarcaProductoDto: CreateMarcaProductoDto) {
    return this.marcaProductoService.create(createMarcaProductoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() marcaProductoPaginationFilter: MarcaProductoPaginationFiltersDto) {
    return this.marcaProductoService.findAll(marcaProductoPaginationFilter);
  }

  @Get(':mapCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MarcaProducto,
  })
  findOne(@Param('mapCodigo', ParseIntPipe) mapCodigo: number) {
    return this.marcaProductoService.findOne(mapCodigo);
  }

  @Patch(':mapCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('mapCodigo', ParseIntPipe) mapCodigo: number, @Body() updateMarcaProductoDto: UpdateMarcaProductoDto) {
    return this.marcaProductoService.update(mapCodigo, updateMarcaProductoDto);
  }

  @Delete(':mapCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('mapCodigo', ParseIntPipe) mapCodigo: number) {
    return this.marcaProductoService.remove(mapCodigo);
  }
}
