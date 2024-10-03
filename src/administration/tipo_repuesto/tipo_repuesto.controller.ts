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
import { TipoRepuestoService } from './tipo_repuesto.service';
import {
  CreateTipoRepuestoDto,
  TipoRepuestoPaginationFiltersDto,
  UpdateTipoRepuestoDto,
} from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipoRepuesto } from './entities/tipo_repuesto.entity';
import { findAllSchema } from './swagger/swagger-schema';
import { PaginationResponseDto } from '../../commons';

@Controller('tipo-repuesto')
@ApiTags('Tipo Repuesto')
@ApiExtraModels(PaginationResponseDto, TipoRepuesto)
export class TipoRepuestoController {
  constructor(private readonly tipoRepuestoService: TipoRepuestoService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TipoRepuesto,
  })
  create(@Body() createTipoRepuestoDto: CreateTipoRepuestoDto) {
    return this.tipoRepuestoService.create(createTipoRepuestoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(
    @Query() tipoRepuestoPaginationFilters: TipoRepuestoPaginationFiltersDto,
  ) {
    return this.tipoRepuestoService.findAll(tipoRepuestoPaginationFilters);
  }

  @Get(':trpCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TipoRepuesto,
  })
  findOne(@Param('trpCodigo', ParseIntPipe) trpCodigo: number) {
    return this.tipoRepuestoService.findOne(trpCodigo);
  }

  @Patch(':trpCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('trpCodigo', ParseIntPipe) trpCodigo: number,
    @Body() updateTipoRepuestoDto: UpdateTipoRepuestoDto,
  ) {
    return this.tipoRepuestoService.update(trpCodigo, updateTipoRepuestoDto);
  }

  @Delete(':trpCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('trpCodigo', ParseIntPipe) trpCodigo: number) {
    return this.tipoRepuestoService.remove(trpCodigo);
  }
}
