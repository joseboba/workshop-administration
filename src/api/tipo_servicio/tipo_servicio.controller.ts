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
import { TipoServicioService } from './tipo_servicio.service';
import {
  CreateTipoServicioDto,
  TipoServicioPaginationFiltersDto,
  UpdateTipoServicioDto,
} from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipoServicio } from './entities/tipo_servicio.entity';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('tipo-servicio')
@ApiTags('Tipo Servicio')
@ApiExtraModels(PaginationResponseDto, TipoServicio)
export class TipoServicioController {
  constructor(private readonly tipoServicioService: TipoServicioService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TipoServicio,
  })
  create(@Body() createTipoServicioDto: CreateTipoServicioDto) {
    return this.tipoServicioService.create(createTipoServicioDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() tipoServicioPaginationFilters: TipoServicioPaginationFiltersDto,
  ) {
    return this.tipoServicioService.findAll(tipoServicioPaginationFilters);
  }

  @Get(':tsrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TipoServicio,
  })
  findOne(@Param('tsrCodigo', ParseIntPipe) tsrCodigo: number) {
    return this.tipoServicioService.findOne(tsrCodigo);
  }

  @Patch(':tsrCodigo')
  update(
    @Param('tsrCodigo', ParseIntPipe) tsrCodigo: number,
    @Body() updateTipoServicioDto: UpdateTipoServicioDto,
  ) {
    return this.tipoServicioService.update(+tsrCodigo, updateTipoServicioDto);
  }

  @Delete(':tsrCodigo')
  remove(@Param('tsrCodigo', ParseIntPipe) tsrCodigo: number) {
    return this.tipoServicioService.remove(+tsrCodigo);
  }
}
