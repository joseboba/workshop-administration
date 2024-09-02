import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto, ProveedorPaginationFilterDto, UpdateProveedorDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { findAllSchema } from './swagger/swagger-schema';
import { Proveedor } from './entities/proveedor.entity';
import { PaginationResponseDto } from '../../commons';

@Controller('proveedor')
@ApiTags('Proveedor')
@ApiExtraModels(PaginationResponseDto, Proveedor)
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Proveedor,
  })
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() proveedorPaginationFilters: ProveedorPaginationFilterDto) {
    return this.proveedorService.findAll(proveedorPaginationFilters);
  }

  @Get(':prvCodigo')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Proveedor,
  })
  findOne(@Param('prvCodigo', ParseIntPipe) prvCodigo: number) {
    return this.proveedorService.findOne(prvCodigo);
  }

  @Patch(':prvCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('prvCodigo', ParseIntPipe) prvCodigo: number, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(prvCodigo, updateProveedorDto);
  }

  @Delete(':prvCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('prvCodigo', ParseIntPipe) prvCodigo: number) {
    return this.proveedorService.remove(prvCodigo);
  }
}
