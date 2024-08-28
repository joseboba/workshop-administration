import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';

export class CotizacionPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
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
    description: 'Busqueda por rango de fechas de vencimiento',
  })
  @Type(() => Date)
  inicioFechaVencimiento: Date | null;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de vencimiento',
  })
  @Type(() => Date)
  finFechaVencimiento: Date | null;
}