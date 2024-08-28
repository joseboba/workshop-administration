import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class MarcaVehiculoPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    description: 'Busqueda por coincidencia de nombres',
    required: false
  })
  search: string;
}