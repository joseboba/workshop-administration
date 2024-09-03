import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { IsString } from 'class-validator';

export class TipoPagoPaginationFiltersDto extends IntersectionType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de nombre o descripción',
  })
  @IsString()
  search: string;
}