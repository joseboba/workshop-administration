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
import { ServicioRepuestoService } from './servicio_repuesto.service';
import { CreateServicioRepuestoDto } from './dto/create-servicio_repuesto.dto';
import { UpdateServicioRepuestoDto } from './dto/update-servicio_repuesto.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServicioRepuesto } from './entities/servicio_repuesto.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { ServicioRepuestoPaginationFiltersDto } from './dto/servicio-repuesto-pagination-filters.dto';

@Controller('servicio-repuesto')
@ApiTags('Servicio Repuesto')
export class ServicioRepuestoController {
  constructor(
    private readonly servicioRepuestoService: ServicioRepuestoService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ServicioRepuesto,
  })
  create(@Body() createServicioRepuestoDto: CreateServicioRepuestoDto) {
    return this.servicioRepuestoService.create(createServicioRepuestoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query()
    servicioRepuestoPaginationFilter: ServicioRepuestoPaginationFiltersDto,
  ) {
    return this.servicioRepuestoService.findAll(
      servicioRepuestoPaginationFilter,
    );
  }

  @Get(':srrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ServicioRepuesto,
  })
  findOne(@Param('srrCodigo', ParseIntPipe) srrCodigo: number) {
    return this.servicioRepuestoService.findOne(srrCodigo);
  }

  @Get('/repuestos/:srvCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ServicioRepuesto,
  })
  findByService(@Param('srvCodigo', ParseIntPipe) srvCodigo: number) {
    return this.servicioRepuestoService.findByService(srvCodigo);
  }

  @Patch(':srrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('srrCodigo', ParseIntPipe) srrCodigo: number,
    @Body() updateServicioRepuestoDto: UpdateServicioRepuestoDto,
  ) {
    return this.servicioRepuestoService.update(
      srrCodigo,
      updateServicioRepuestoDto,
    );
  }

  @Delete(':srrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('srrCodigo', ParseIntPipe) srrCodigo: number) {
    return this.servicioRepuestoService.remove(srrCodigo);
  }
}
