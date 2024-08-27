import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MecanicoService } from './mecanico.service';
import { CreateMecanicoDto, UpdateMecanicoDto } from './dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../commons';
import { Mecanico } from './entities/mecanico.entity';
import { findAllSchema } from './swagger/swagger-schema';

@Controller('mecanico')
@ApiTags('Mecanico')
@ApiExtraModels(PaginationResponseDto, Mecanico)
export class MecanicoController {
  constructor(private readonly mecanicoService: MecanicoService) {
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Mecanico,
  })
  create(@Body() createMecanicoDto: CreateMecanicoDto) {
    return this.mecanicoService.create(createMecanicoDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: findAllSchema,
  })
  findAll() {
    return this.mecanicoService.findAll();
  }

  @Get(':mecCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Mecanico,
  })
  findOne(@Param('mecCodigo', ParseIntPipe) mecCodigo: number) {
    return this.mecanicoService.findOne(+mecCodigo);
  }

  @Patch(':mecCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  update(
    @Param('mecCodigo', ParseIntPipe) mecCodigo: number,
    @Body() updateMecanicoDto: UpdateMecanicoDto,
  ) {
    return this.mecanicoService.update(+mecCodigo, updateMecanicoDto);
  }

  @Delete(':mecCodigo')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('mecCodigo', ParseIntPipe) mecCodigo: number) {
    return this.mecanicoService.remove(+mecCodigo);
  }
}
