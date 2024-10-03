import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class TipoServicioPaginationFiltersDto extends PartialType(
  PaginationFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de nombre o descripción',
  })
  search: string;
}