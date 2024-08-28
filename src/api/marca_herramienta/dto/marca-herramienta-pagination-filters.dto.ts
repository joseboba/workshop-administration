import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class MarcaHerramientaPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de nombre',
  })
  search: string;
}