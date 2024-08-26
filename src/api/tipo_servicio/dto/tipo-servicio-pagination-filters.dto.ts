import { PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class TipoServicioPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  search: string;
}