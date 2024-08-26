import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    type: [Object],
  })
  content: T[];

  @ApiProperty()
  totalElements: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  firstPage: boolean;

  @ApiProperty()
  lastPage: boolean;
}
