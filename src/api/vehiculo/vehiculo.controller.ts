import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Vehiculo } from './entities/vehiculo.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { VehiculoPaginationFiltersDto } from './dto/vehiculo-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';

@Controller('vehiculo')
@ApiTags('Vehiculo')
@ApiExtraModels(PaginationResponseDto, Vehiculo)
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Vehiculo,
  })
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculoService.create(createVehiculoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Vehiculo,
  })
  findAll(
    @Query() vehiculoPaginationFilters: VehiculoPaginationFiltersDto,
  ) {
    return this.vehiculoService.findAll(vehiculoPaginationFilters);
  }

  @Get(':vehPlaca')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findOne(@Param('vehPlaca') vehPlaca: string) {
    return this.vehiculoService.findOne(vehPlaca);
  }

  @Patch(':vehPlaca')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('vehPlaca') vehPlaca: string,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.update(vehPlaca, updateVehiculoDto);
  }

  @Delete(':vehPlaca')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('vehPlaca') vehPlaca: string) {
    return this.vehiculoService.remove(vehPlaca);
  }
}
