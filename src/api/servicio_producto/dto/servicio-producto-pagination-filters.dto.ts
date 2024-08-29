import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';


export class ServicioProductoPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por nombre de producto',
  })
  producto: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia por nombre de servicio',
  })
  servicio: string;
}