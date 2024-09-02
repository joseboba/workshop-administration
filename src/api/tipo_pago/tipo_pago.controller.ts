import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TipoPagoService } from './tipo_pago.service';
import { CreateTipoPagoDto, TipoPagoPaginationFiltersDto, UpdateTipoPagoDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipoPago } from './entities/tipo_pago.entity';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('tipo-pago')
@ApiTags('Tipo Pago')
@ApiExtraModels(PaginationResponseDto, TipoPago)
export class TipoPagoController {
  constructor(private readonly tipoPagoService: TipoPagoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TipoPago,
  })
  create(@Body() createTipoPagoDto: CreateTipoPagoDto) {
    return this.tipoPagoService.create(createTipoPagoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() tipoPagoPaginationFilters: TipoPagoPaginationFiltersDto) {
    return this.tipoPagoService.findAll(tipoPagoPaginationFilters);
  }

  @Get(':tpaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TipoPago,
  })
  findOne(@Param('tpaCodigo', ParseIntPipe) tpaCodigo: string) {
    return this.tipoPagoService.findOne(tpaCodigo);
  }

  @Patch(':tpaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(@Param('tpaCodigo', ParseIntPipe) tpaCodigo: string, @Body() updateTipoPagoDto: UpdateTipoPagoDto) {
    return this.tipoPagoService.update(tpaCodigo, updateTipoPagoDto);
  }

  @Delete(':tpaCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('tpaCodigo', ParseIntPipe) tpaCodigo: string) {
    return this.tipoPagoService.remove(tpaCodigo);
  }
}
