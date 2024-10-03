import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ServicioOrdenTrabajoService } from './servicio_orden_trabajo.service';
import { CreateServicioOrdenTrabajoDto } from './dto/create-servicio_orden_trabajo.dto';
import { UpdateServicioOrdenTrabajoDto } from './dto/update-servicio_orden_trabajo.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdenTrabajo } from '../../administration/orden_trabajo/entities/orden_trabajo.entity';
import { ServicioOrdenTrabajo } from '../../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import { findAllSchema } from '../orden_trabajo/swagger/findAllSchema';
import { ServicioOrdenTrabajoPaginationFilterDto } from './dto/servicio-orden-trabajo-pagination-filter.dto';

@Controller('servicio-orden-trabajo')
@ApiTags('Servicio Orden Trabajo')
export class ServicioOrdenTrabajoController {
  constructor(
    private readonly servicioOrdenTrabajoService: ServicioOrdenTrabajoService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ServicioOrdenTrabajo,
  })
  create(@Body() createServicioOrdenTrabajoDto: CreateServicioOrdenTrabajoDto) {
    return this.servicioOrdenTrabajoService.create(
      createServicioOrdenTrabajoDto,
    );
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query()
    servicioOrdenTrabajoPaginationFilters: ServicioOrdenTrabajoPaginationFilterDto,
  ) {
    return this.servicioOrdenTrabajoService.findAll(
      servicioOrdenTrabajoPaginationFilters,
    );
  }

  @Get(':sorCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ServicioOrdenTrabajo,
  })
  findOne(@Param('sorCodigo', ParseIntPipe) sorCodigo: number) {
    return this.servicioOrdenTrabajoService.findOne(sorCodigo);
  }

  @Patch(':sorCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('sorCodigo', ParseIntPipe) sorCodigo: number,
    @Body() updateServicioOrdenTrabajoDto: UpdateServicioOrdenTrabajoDto,
  ) {
    return this.servicioOrdenTrabajoService.update(
      +sorCodigo,
      updateServicioOrdenTrabajoDto,
    );
  }

  @Delete(':sorCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('sorCodigo', ParseIntPipe) sorCodigo: number) {
    return this.servicioOrdenTrabajoService.remove(+sorCodigo);
  }

  @Put('/agragarProducto/:sorCodigo/:proCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  agregarProducto(
    @Param('sorCodigo', ParseIntPipe) sorCodigo: number,
    @Param('proCodigo', ParseIntPipe) proCodigo: number,
    @Query('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return this.servicioOrdenTrabajoService.agergarProducto(
      sorCodigo,
      proCodigo,
      cantidad,
    );
  }

  @Put('/agragarRepuesto/:sorCodigo/:repCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  agregarRepuesto(
    @Param('sorCodigo', ParseIntPipe) sorCodigo: number,
    @Param('repCodigo', ParseIntPipe) repCodigo: number,
    @Query('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return this.servicioOrdenTrabajoService.agregarRepuesto(
      sorCodigo,
      repCodigo,
      cantidad,
    );
  }

  @Put('/terminarServicio/:sorCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  termiarServicio(@Param('sorCodigo', ParseIntPipe) sorCodigo: number) {
    return this.servicioOrdenTrabajoService.terminarServicioOrdenTrabajo(
      sorCodigo,
    );
  }
}
