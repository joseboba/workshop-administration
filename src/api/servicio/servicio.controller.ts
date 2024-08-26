import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { CreateServicioDto, ServicioPaginationFiltersDto, UpdateServicioDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Servicio } from './entities/servicio.entity';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('servicio')
@ApiTags('Servicio')
@ApiExtraModels(PaginationResponseDto, Servicio)
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Servicio,
  })
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.servicioService.create(createServicioDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() servicioPaginationFilters: ServicioPaginationFiltersDto) {
    return this.servicioService.findAll(servicioPaginationFilters);
  }

  @Get(':srvCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Servicio,
  })
  findOne(@Param('srvCodigo', ParseIntPipe) srvCodigo: number) {
    return this.servicioService.findOne(srvCodigo);
  }

  @Patch(':srvCodigo')
  update(@Param('srvCodigo', ParseIntPipe) srvCodigo: number, @Body() updateServicioDto: UpdateServicioDto) {
    return this.servicioService.update(srvCodigo, updateServicioDto);
  }

  @Delete(':srvCodigo')
  remove(@Param('srvCodigo', ParseIntPipe) srvCodigo: number) {
    return this.servicioService.remove(srvCodigo);
  }
}
