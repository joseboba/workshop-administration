import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { EquipoTallerService } from './equipo_taller.service';
import { CreateEquipoTallerDto } from './dto/create-equipo_taller.dto';
import { UpdateEquipoTallerDto } from './dto/update-equipo_taller.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { EquipoTaller } from './entities/equipo_taller.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { EquipoTallerPaginationDto } from './dto/equipo-taller-pagination.dto';

@Controller('equipo-taller')
@ApiTags('Equipo Taller')
@ApiExtraModels(PaginationResponseDto, EquipoTaller)
export class EquipoTallerController {
  constructor(private readonly equipoTallerService: EquipoTallerService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: EquipoTaller,
  })
  create(@Body() createEquipoTallerDto: CreateEquipoTallerDto) {
    return this.equipoTallerService.create(createEquipoTallerDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() equipoTallerPaginationFilters: EquipoTallerPaginationDto
  ) {
    return this.equipoTallerService.findAll(equipoTallerPaginationFilters);
  }

  @Get(':etaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: EquipoTaller,
  })
  findOne(@Param('etaCodigo', ParseIntPipe) etaCodigo: number) {
    return this.equipoTallerService.findOne(etaCodigo);
  }

  @Patch(':etaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('etaCodigo', ParseIntPipe) etaCodigo: number, @Body() updateEquipoTallerDto: UpdateEquipoTallerDto) {
    return this.equipoTallerService.update(etaCodigo, updateEquipoTallerDto);
  }

  @Delete(':etaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('etaCodigo', ParseIntPipe) etaCodigo: number) {
    return this.equipoTallerService.remove(etaCodigo);
  }
}
