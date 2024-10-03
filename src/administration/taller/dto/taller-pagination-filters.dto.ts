import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class TallerPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Busqueda por coincidencia de nombre',
  })
  nombre: string;
  @ApiProperty({
    type: String,
    required: false,
    description: 'Busqueda por coincidencia de nombre',
  })
  direccion: string;
  @ApiProperty({
    type: String,
    required: false,
    description: 'Busqueda por coincidencia de telefono',
  })
  telefono: string;
  @ApiProperty({
    type: String,
    required: false,
    description: 'Busqueda por coincidencia de correo',
  })
  correo: string;
}