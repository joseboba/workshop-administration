import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Producto } from './entities/producto.entity';
import { ProductoPaginationFiltersDto } from './dto/producto-pagination-filters.dto';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('producto')
@ApiTags('Producto')
@ApiExtraModels(PaginationResponseDto, Producto)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Producto,
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() productoPaginationFilter: ProductoPaginationFiltersDto) {
    return this.productoService.findAll(productoPaginationFilter);
  }

  @Get(':proCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Producto,
  })
  findOne(@Param('proCodigo', ParseIntPipe) proCodigo: number) {
    return this.productoService.findOne(proCodigo);
  }

  @Patch(':proCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('proCodigo', ParseIntPipe) proCodigo: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(proCodigo, updateProductoDto);
  }

  @Delete(':proCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('proCodigo', ParseIntPipe) proCodigo: number) {
    return this.productoService.remove(proCodigo);
  }
}
