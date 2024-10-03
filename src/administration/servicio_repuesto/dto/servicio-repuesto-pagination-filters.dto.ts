import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class ServicioRepuestoPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por nombre de repuesto',
  })
  repuesto: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por nombre de servicio',
  })
  servicio: string;
}