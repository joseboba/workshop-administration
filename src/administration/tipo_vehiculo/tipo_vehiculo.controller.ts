import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TipoVehiculoService } from './tipo_vehiculo.service';
import { CreateTipoVehiculoDto, TipoVehiculoPaginationFiltersDto, UpdateTipoVehiculoDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipoVehiculo } from './entities/tipo_vehiculo.entity';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('tipo-vehiculo')
@ApiTags('Tipo Vehiculo')
@ApiExtraModels(PaginationResponseDto, TipoVehiculo)
export class TipoVehiculoController {
  constructor(private readonly tipoVehiculoService: TipoVehiculoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TipoVehiculo,
  })
  create(@Body() createTipoVehiculoDto: CreateTipoVehiculoDto) {
    return this.tipoVehiculoService.create(createTipoVehiculoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() tipoVehiculoPaginationFiltersDto: TipoVehiculoPaginationFiltersDto,
  ) {
    return this.tipoVehiculoService.findAll(tipoVehiculoPaginationFiltersDto);
  }

  @Get(':tveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TipoVehiculo,
  })
  findOne(@Param('tveCodigo', ParseIntPipe) tveCodigo: number) {
    return this.tipoVehiculoService.findOne(tveCodigo);
  }

  @Patch(':tveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('tveCodigo', ParseIntPipe) tveCodigo: number,
    @Body() updateTipoVehiculoDto: UpdateTipoVehiculoDto,
  ) {
    return this.tipoVehiculoService.update(tveCodigo, updateTipoVehiculoDto);
  }

  @Delete(':tveCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('tveCodigo', ParseIntPipe) tveCodigo: number) {
    return this.tipoVehiculoService.remove(tveCodigo);
  }
}
