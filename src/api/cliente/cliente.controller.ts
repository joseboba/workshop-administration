import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post, Query,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto, UpdateClienteDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cliente } from './entities/cliente.entity';
import { PaginationResponseDto } from '../../commons';
import { findAllSchema } from './swagger/swagger-schema';
import { ClientePaginationFiltersDto } from './dto/cliente-pagination-filters.dto';

@Controller('cliente')
@ApiTags('Cliente')
@ApiExtraModels(PaginationResponseDto, Cliente)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Cliente,
  })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll(@Query() clientePaginationFilters: ClientePaginationFiltersDto) {
    return this.clienteService.findAll(clientePaginationFilters);
  }

  @Get(':cliCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Cliente,
  })
  findOne(@Param('cliCodigo', ParseIntPipe) cliCodigo: number) {
    return this.clienteService.findOne(cliCodigo);
  }

  @Patch(':cliCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('cliCodigo', ParseIntPipe) cliCodigo: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(cliCodigo, updateClienteDto);
  }

  @Delete(':cliCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('cliCodigo', ParseIntPipe) cliCodigo: number) {
    return this.clienteService.remove(cliCodigo);
  }
}
