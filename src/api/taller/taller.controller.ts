import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { TallerService } from './taller.service';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Taller } from './entities/taller.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { TallerPaginationFiltersDto } from './dto/taller-pagination-filters.dto';

@Controller('taller')
@ApiTags('Taller')
@ApiExtraModels(PaginationResponseDto, Taller)
export class TallerController {
  constructor(private readonly tallerService: TallerService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Taller,
  })
  create(@Body() createTallerDto: CreateTallerDto) {
    return this.tallerService.create(createTallerDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: findAllSchema,
  })
  findAll(@Query() tallerPaginationFilters: TallerPaginationFiltersDto) {
    return this.tallerService.findAll(tallerPaginationFilters);
  }

  @Get(':tllCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Taller
  })
  findOne(@Param('tllCodigo', ParseIntPipe) tllCodigo: number) {
    return this.tallerService.findOne(tllCodigo);
  }

  @Patch(':tllCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('tllCodigo', ParseIntPipe) tllCodigo: number, @Body() updateTallerDto: UpdateTallerDto) {
    return this.tallerService.update(tllCodigo, updateTallerDto);
  }

  @Delete(':tllCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('tllCodigo', ParseIntPipe) tllCodigo: number) {
    return this.tallerService.remove(tllCodigo);
  }
}
