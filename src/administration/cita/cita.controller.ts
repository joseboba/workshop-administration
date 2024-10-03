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
import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Cita } from './entities/cita.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { CitaPaginationFiltersDto } from './dto/cita-pagination-filters.dto';

@Controller('cita')
@ApiTags('Cita')
@ApiExtraModels(PaginationResponseDto, Cita)
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Cita,
  })
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citaService.create(createCitaDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: findAllSchema,
  })
  findAll(@Query() citaPaginationFilter: CitaPaginationFiltersDto) {
    return this.citaService.findAll(citaPaginationFilter);
  }

  @Get(':ctaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Cita,
  })
  findOne(@Param('ctaCodigo', ParseIntPipe) ctaCodigo: number) {
    return this.citaService.findOne(ctaCodigo);
  }

  @Patch(':ctaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('ctaCodigo', ParseIntPipe) ctaCodigo: number,
    @Body() updateCitaDto: UpdateCitaDto,
  ) {
    return this.citaService.update(ctaCodigo, updateCitaDto);
  }

  @Delete(':ctaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('ctaCodigo', ParseIntPipe) ctaCodigo: number) {
    return this.citaService.remove(ctaCodigo);
  }
}
