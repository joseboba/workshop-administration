import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class VehiculoPaginationFiltersDto extends PartialType(
  PaginationFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por placa',
  })
  placa: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por chasis',
  })
  chasis: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por color',
  })
  color: string;
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Busqueda por kilometraje',
  })
  kilometraje: number;
}
