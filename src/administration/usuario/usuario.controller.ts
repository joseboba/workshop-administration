import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Usuario } from './entities/usuario.entity';
import { UsuarioPaginationFiltersDto } from './dto/usuario-pagination-filters.dto';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('usuario')
@ApiTags('Usuarios')
@ApiExtraModels(PaginationResponseDto, Usuario)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Usuario,
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: findAllSchema,
  })
  findAll(@Query() usuarioPaginationFiltersDto: UsuarioPaginationFiltersDto) {
    return this.usuarioService.findAll(usuarioPaginationFiltersDto);
  }

  @Get(':usrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Usuario,
  })
  findOne(@Param('usrCodigo', ParseIntPipe) usrCodigo: number) {
    return this.usuarioService.findOne(usrCodigo);
  }

  @Patch(':usrCodigo')
  update(@Param('usrCodigo', ParseIntPipe) usrCodigo: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(usrCodigo, updateUsuarioDto);
  }

  @Delete(':usrCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('usrCodigo', ParseIntPipe) usrCodigo: number) {
    return this.usuarioService.remove(usrCodigo);
  }
}
