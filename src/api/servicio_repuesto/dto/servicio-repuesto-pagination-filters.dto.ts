import { PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';

export class ServicioRepuestoPaginationFiltersDto extends PartialType(PaginationFiltersDto) {  }