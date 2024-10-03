import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdenTrabajoService } from './orden_trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden_trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden_trabajo.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { OrdenTrabajo } from '../../administration/orden_trabajo/entities/orden_trabajo.entity';
import { findAllSchema } from './swagger/findAllSchema';
import { OrdenTrabajoPaginationFilterDto } from './dto/orden-trabajo-pagination-filter.dto';
import { UpdateDesperfectoOrdenTrabajoDto } from './dto/update_desperfecto_orden_trabajo.dto';

@Controller('orden-trabajo')
@ApiTags('Orden Trabajo')
@ApiExtraModels(PaginationResponseDto, OrdenTrabajo)
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrdenTrabajo,
  })
  create(@Body() createOrdenTrabajoDto: CreateOrdenTrabajoDto) {
    return this.ordenTrabajoService.create(createOrdenTrabajoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() ordenTrabajoPaginationFilterDto: OrdenTrabajoPaginationFilterDto,
  ) {
    return this.ordenTrabajoService.findAll(ordenTrabajoPaginationFilterDto);
  }

  @Get(':ortCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrdenTrabajo,
  })
  findOne(@Param('ortCodigo', ParseIntPipe) ortCodigo: number) {
    return this.ordenTrabajoService.findOne(ortCodigo);
  }

  @Patch(':ortCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('ortCodigo', ParseIntPipe) ortCodigo: number,
    @Body() updateOrdenTrabajoDto: UpdateOrdenTrabajoDto,
  ) {
    return this.ordenTrabajoService.update(ortCodigo, updateOrdenTrabajoDto);
  }

  @Post('desperfecto')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  agregarDesperfecto(
    @Body() updateOrdenTrabajoDto: UpdateDesperfectoOrdenTrabajoDto,
  ) {
    return this.ordenTrabajoService.agregarDesperfecto(updateOrdenTrabajoDto);
  }

  @Delete(':ortCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('ortCodigo', ParseIntPipe) ortCodigo: number) {
    return this.ordenTrabajoService.remove(ortCodigo);
  }
}
