import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';

export class OrdenTrabajoPaginationFilterDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de creación',
  })
  @Type(() => Date)
  inicioFechaCreacion: Date | null;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de creación',
  })
  @Type(() => Date)
  finFechaCreacion: Date | null;

  @ApiProperty({
    required: false,
    description: 'Busqueda por cita',
  })
  @Type(() => Number)
  cita?: number;

  @ApiProperty({
    required: false,
    description: 'Busqueda por vehiculo',
  })
  @Type(() => String)
  placa?: string;
}