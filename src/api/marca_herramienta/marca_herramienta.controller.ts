import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { MarcaHerramientaService } from './marca_herramienta.service';
import { CreateMarcaHerramientaDto } from './dto/create-marca_herramienta.dto';
import { UpdateMarcaHerramientaDto } from './dto/update-marca_herramienta.dto';
import { MarcaHerramientaPaginationFiltersDto } from './dto/marca-herramienta-pagination-filters.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarcaHerramienta } from './entities/marca_herramienta.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { PaginationResponseDto } from '../../commons';

@Controller('marca-herramienta')
@ApiTags('Marca Herramienta')
@ApiExtraModels(PaginationResponseDto, MarcaHerramienta)
export class MarcaHerramientaController {
  constructor(
    private readonly marcaHerramientaService: MarcaHerramientaService,
  ) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MarcaHerramienta,
  })
  create(@Body() createMarcaHerramientaDto: CreateMarcaHerramientaDto) {
    return this.marcaHerramientaService.create(createMarcaHerramientaDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MarcaHerramienta,
  })
  findAll(
    @Query() marcaHerramientaPaginationFilters: MarcaHerramientaPaginationFiltersDto,
  ) {
    return this.marcaHerramientaService.findAll(marcaHerramientaPaginationFilters);
  }

  @Get(':mheCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findOne(@Param('mheCodigo', ParseIntPipe) mheCodigo: number) {
    return this.marcaHerramientaService.findOne(mheCodigo);
  }

  @Patch(':mheCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('mheCodigo', ParseIntPipe) mheCodigo: number,
    @Body() updateMarcaHerramientaDto: UpdateMarcaHerramientaDto,
  ) {
    return this.marcaHerramientaService.update(
      mheCodigo,
      updateMarcaHerramientaDto,
    );
  }

  @Delete(':mheCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('mheCodigo', ParseIntPipe) mheCodigo: number) {
    return this.marcaHerramientaService.remove(mheCodigo);
  }
}
