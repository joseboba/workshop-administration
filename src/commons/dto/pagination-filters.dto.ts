import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationFiltersDto {
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: Number,
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
  })
  sort?: string;
}
