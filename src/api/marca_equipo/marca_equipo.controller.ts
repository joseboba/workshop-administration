import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { MarcaEquipoService } from './marca_equipo.service';
import { CreateMarcaEquipoDto } from './dto/create-marca_equipo.dto';
import { UpdateMarcaEquipoDto } from './dto/update-marca_equipo.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarcaEquipo } from './entities/marca_equipo.entity';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from '../cliente/swagger/swagger-schema';
import { MarcaEquipoPaginationFiltersDto } from './dto/marca-equipo-pagination-filters.dto';

@Controller('marca-equipo')
@ApiTags('Marca Equipo')
@ApiExtraModels(PaginationResponseDto, MarcaEquipo)
export class MarcaEquipoController {
  constructor(private readonly marcaEquipoService: MarcaEquipoService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MarcaEquipo,
  })
  create(@Body() createMarcaEquipoDto: CreateMarcaEquipoDto) {
    return this.marcaEquipoService.create(createMarcaEquipoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() marcaEquipoPaginationFilters: MarcaEquipoPaginationFiltersDto) {
    return this.marcaEquipoService.findAll(marcaEquipoPaginationFilters);
  }

  @Get(':meqCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MarcaEquipo,
  })
  findOne(@Param('meqCodigo', ParseIntPipe) meqCodigo: number) {
    return this.marcaEquipoService.findOne(meqCodigo);
  }

  @Patch(':meqCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('meqCodigo', ParseIntPipe) meqCodigo: number, @Body() updateMarcaEquipoDto: UpdateMarcaEquipoDto) {
    return this.marcaEquipoService.update(meqCodigo, updateMarcaEquipoDto);
  }

  @Delete(':meqCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('meqCodigo', ParseIntPipe) meqCodigo: number) {
    return this.marcaEquipoService.remove(meqCodigo);
  }
}
