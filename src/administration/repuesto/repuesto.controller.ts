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
  Query,
} from '@nestjs/common';
import { RepuestoService } from './repuesto.service';
import { CreateRepuestoDto, UpdateRepuestoDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { findAllSchema } from './swagger/swagger-schema';
import { Repuesto } from './entities/repuesto.entity';
import { RepuestoPaginationFiltersDto } from './dto/repuesto-pagination-filters.dto';
import { PaginationResponseDto } from '../../commons';

@Controller('repuesto')
@ApiTags('Response')
@ApiExtraModels(PaginationResponseDto, Repuesto)
export class RepuestoController {
  constructor(private readonly repuestoService: RepuestoService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Repuesto,
  })
  create(@Body() createRepuestoDto: CreateRepuestoDto) {
    return this.repuestoService.create(createRepuestoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() repuestoPaginationFilters: RepuestoPaginationFiltersDto) {
    return this.repuestoService.findAll(repuestoPaginationFilters);
  }

  @Get(':repCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Repuesto,
  })
  findOne(@Param('repCodigo', ParseIntPipe) repCodigo: number) {
    return this.repuestoService.findOne(repCodigo);
  }

  @Patch(':repCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('repCodigo', ParseIntPipe) repCodigo: number, @Body() updateRepuestoDto: UpdateRepuestoDto) {
    return this.repuestoService.update(repCodigo, updateRepuestoDto);
  }

  @Delete(':repCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('repCodigo', ParseIntPipe) repCodigo: number) {
    return this.repuestoService.remove(repCodigo);
  }
}
