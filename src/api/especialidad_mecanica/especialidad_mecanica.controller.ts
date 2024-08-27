import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EspecialidadMecanicaService } from './especialidad_mecanica.service';
import { CreateEspecialidadMecanicaDto, UpdateEspecialidadMecanicaDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { EspecialidadMecanica } from './entities/especialidad_mecanica.entity';
import { findAllSchema } from './swagger/swagger-schema';


@Controller('especialidad-mecanica')
@ApiTags('Especialidad Mecanica')
@ApiExtraModels(PaginationResponseDto, EspecialidadMecanica)
export class EspecialidadMecanicaController {
  constructor(private readonly especialidadMecanicaService: EspecialidadMecanicaService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: EspecialidadMecanica,
  })
  create(@Body() createEspecialidadMecanicaDto: CreateEspecialidadMecanicaDto) {
    return this.especialidadMecanicaService.create(createEspecialidadMecanicaDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll() {
    return this.especialidadMecanicaService.findAll();
  }

  @Get(':emeCodig')
  @ApiResponse({
    status: HttpStatus.OK,
    type: EspecialidadMecanica,
  })
  findOne(@Param('emeCodigo', ParseIntPipe) emeCodigo: number) {
    return this.especialidadMecanicaService.findOne(emeCodigo);
  }

  @Patch(':emeCodig')
  update(@Param('emeCodigo', ParseIntPipe) emeCodigo: number, @Body() updateEspecialidadMecanicaDto: UpdateEspecialidadMecanicaDto) {
    return this.especialidadMecanicaService.update(emeCodigo, updateEspecialidadMecanicaDto);
  }

  @Delete(':emeCodig')
  remove(@Param('emeCodigo', ParseIntPipe) emeCodigo: number) {
    return this.especialidadMecanicaService.remove(emeCodigo);
  }
}
