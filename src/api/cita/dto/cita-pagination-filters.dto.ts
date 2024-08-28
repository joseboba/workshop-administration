import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';


export class CitaPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de descripción',
  })
  search: string;
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
}