import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';

export class ServicioPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    type: String,
    required: false,
  })
  search: string;
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    required: false,
  })
  tsrCodigo: number;
}
