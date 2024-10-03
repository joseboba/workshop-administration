import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class MecanicoPaginationFiltersDto extends PartialType(
  PaginationFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de nombres o apellidos',
  })
  search: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por DPI de cliente',
  })
  dpi: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por NIT de cliente',
  })
  nit: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por el télefono del cliente',
  })
  telefono: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia del correo del cliente',
  })
  correo: string;
}
