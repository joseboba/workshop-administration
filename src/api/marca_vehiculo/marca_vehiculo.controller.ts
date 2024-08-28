import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MarcaVehiculoService } from './marca_vehiculo.service';
import { CreateMarcaVehiculoDto, UpdateMarcaVehiculoDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { MarcaVehiculo } from './entities/marca_vehiculo.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { MarcaVehiculoPaginationFiltersDto } from './dto/marca-vehiculo-pagination-filters.dto';

@Controller('marca-vehiculo')
@ApiTags('Marca Vehiculo')
@ApiExtraModels(PaginationResponseDto, MarcaVehiculo)
export class MarcaVehiculoController {
  constructor(private readonly marcaVehiculoService: MarcaVehiculoService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: MarcaVehiculo,
  })
  create(@Body() createMarcaVehiculoDto: CreateMarcaVehiculoDto) {
    return this.marcaVehiculoService.create(createMarcaVehiculoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() marcaVehiculoPaginationFilters: MarcaVehiculoPaginationFiltersDto,
  ) {
    return this.marcaVehiculoService.findAll(marcaVehiculoPaginationFilters);
  }

  @Get(':mveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: MarcaVehiculo,
  })
  findOne(@Param('mveCodigo', ParseIntPipe) mveCodigo: number) {
    return this.marcaVehiculoService.findOne(mveCodigo);
  }

  @Patch(':mveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('mveCodigo', ParseIntPipe) mveCodigo: number,
    @Body() updateMarcaVehiculoDto: UpdateMarcaVehiculoDto,
  ) {
    return this.marcaVehiculoService.update(mveCodigo, updateMarcaVehiculoDto);
  }

  @Delete(':mveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('mveCodigo', ParseIntPipe) mveCodigo: number) {
    return this.marcaVehiculoService.remove(mveCodigo);
  }
}
