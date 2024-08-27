import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';

export class ServicioPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Busqueda por coincidencia de nombre o descripción',
  })
  search: string;
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    required: false,
    description: 'Código para filtrar por tipo de servicio',
  })
  tsrCodigo: number;
}
