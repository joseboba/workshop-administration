import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { HerramientaService } from './herramienta.service';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { UpdateHerramientaDto } from './dto/update-herramienta.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Herramienta } from './entities/herramienta.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { HerramientaPaginationFiltersDto } from './dto/herramienta-pagination-filters.dto';

@Controller('herramienta')
@ApiTags('Herramientas')
@ApiExtraModels(PaginationResponseDto, Herramienta)
export class HerramientaController {
  constructor(private readonly herramientaService: HerramientaService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Herramienta,
  })
  create(@Body() createHerramientaDto: CreateHerramientaDto) {
    return this.herramientaService.create(createHerramientaDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() herramientaPaginationFilter: HerramientaPaginationFiltersDto,
  ) {
    return this.herramientaService.findAll(herramientaPaginationFilter);
  }

  @Get(':herCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Herramienta,
  })
  findOne(@Param('herCodigo', ParseIntPipe) herCodigo: number) {
    return this.herramientaService.findOne(herCodigo);
  }

  @Patch(':herCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('herCodigo', ParseIntPipe) herCodigo: number, @Body() updateHerramientaDto: UpdateHerramientaDto) {
    return this.herramientaService.update(herCodigo, updateHerramientaDto);
  }

  @Delete(':herCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('herCodigo', ParseIntPipe) herCodigo: number) {
    return this.herramientaService.remove(herCodigo);
  }
}
