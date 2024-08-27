import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class ProveedorPaginationFilterDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de nombre o nombre de contacto',
  })
  search: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de telefono',
  })
  telefono: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de correo electrónico',
  })
  correo: string;
}