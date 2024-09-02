import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cotizacion } from './entities/cotizacion.entity';
import { CotizacionPaginationFiltersDto } from './dto/cotizacion-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('cotizacion')
@ApiTags('Cotizacion')
@ApiExtraModels(PaginationResponseDto, Cotizacion)
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Cotizacion,
  })
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.cotizacionService.create(createCotizacionDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() cotizacionPaginationFilters: CotizacionPaginationFiltersDto,
  ) {
    return this.cotizacionService.findAll(cotizacionPaginationFilters);
  }

  @Get(':cotCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Cotizacion,
  })
  findOne(@Param('cotCodigo', ParseIntPipe) cotCodigo: number) {
    return this.cotizacionService.findOne(cotCodigo);
  }

  @Patch(':cotCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('cotCodigo', ParseIntPipe) cotCodigo: number, @Body() updateCotizacionDto: UpdateCotizacionDto) {
    return this.cotizacionService.update(cotCodigo, updateCotizacionDto);
  }

  @Delete(':cotCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('cotCodigo', ParseIntPipe) cotCodigo: number) {
    return this.cotizacionService.remove(cotCodigo);
  }
}
