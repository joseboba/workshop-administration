import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, HttpStatus,
} from '@nestjs/common';
import { NivelGravedadService } from './nivel_gravedad.service';
import { CreateNivelGravedadDto, UpdateNivelGravedadDto } from './dto';
import { NivelGravedadPaginationFiltersDto } from './dto/nivel-gravedad-pagination-filters.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NivelGravedad } from './entities/nivel_gravedad.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { PaginationResponseDto } from '../../commons';

@Controller('nivel-gravedad')
@ApiTags('Nivel Gravedad')
@ApiExtraModels(PaginationResponseDto, NivelGravedad)
export class NivelGravedadController {
  constructor(private readonly nivelGravedadService: NivelGravedadService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: NivelGravedad,
  })
  create(@Body() createNivelGravedadDto: CreateNivelGravedadDto) {
    return this.nivelGravedadService.create(createNivelGravedadDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() nivelGravedadPaginationFilters: NivelGravedadPaginationFiltersDto,
  ) {
    return this.nivelGravedadService.findAll(nivelGravedadPaginationFilters);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: NivelGravedad,
  })
  findOne(@Param('id') id: string) {
    return this.nivelGravedadService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('id') id: string,
    @Body() updateNivelGravedadDto: UpdateNivelGravedadDto,
  ) {
    return this.nivelGravedadService.update(+id, updateNivelGravedadDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('id') id: string) {
    return this.nivelGravedadService.remove(+id);
  }
}
