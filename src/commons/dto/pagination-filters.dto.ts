import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationFiltersDto {
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: Number,
    description: 'Tamaño de la página, valor por defecto es 10'
  })
  size?: number;

  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: Number,
  })
  page?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Parametro de ordenamiento proiedad,(asc|desc)',
  })
  sort?: string;
}
