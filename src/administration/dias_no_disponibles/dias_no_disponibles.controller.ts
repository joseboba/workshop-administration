import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Query } from '@nestjs/common';
import { DiasNoDisponiblesService } from './dias_no_disponibles.service';
import { CreateDiasNoDisponibleDto } from './dto/create-dias_no_disponible.dto';
import { UpdateDiasNoDisponibleDto } from './dto/update-dias_no_disponible.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { DiasNoDisponible } from './entities/dias_no_disponible.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { DiasNoDisponiblesPaginationFiltersDto } from './dto/dias-no-disponibles-pagination-filters.dto';

@Controller('dias-no-disponibles')
@ApiTags('Dias no disponibles')
@ApiExtraModels(PaginationResponseDto, DiasNoDisponible)
export class DiasNoDisponiblesController {
  constructor(private readonly diasNoDisponiblesService: DiasNoDisponiblesService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: DiasNoDisponible
  })
  create(@Body() createDiasNoDisponibleDto: CreateDiasNoDisponibleDto) {
    return this.diasNoDisponiblesService.create(createDiasNoDisponibleDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema
  })
  findAll(
    @Query() diasNoDisponiblesPaginationFilters: DiasNoDisponiblesPaginationFiltersDto
  ) {
    return this.diasNoDisponiblesService.findAll(diasNoDisponiblesPaginationFilters);
  }

  @Get(':dndCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DiasNoDisponible
  })
  findOne(@Param('dndCodigo', ParseIntPipe) dndCodigo: number) {
    return this.diasNoDisponiblesService.findOne(dndCodigo);
  }

  @Patch(':dndCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('dndCodigo', ParseIntPipe) dndCodigo: number, @Body() updateDiasNoDisponibleDto: UpdateDiasNoDisponibleDto) {
    return this.diasNoDisponiblesService.update(dndCodigo, updateDiasNoDisponibleDto);
  }

  @Delete(':dndCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('dndCodigo', ParseIntPipe) dndCodigo: number) {
    return this.diasNoDisponiblesService.remove(dndCodigo);
  }
}
