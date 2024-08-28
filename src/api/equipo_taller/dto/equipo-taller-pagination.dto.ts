import { PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';


export class EquipoTallerPaginationDto extends PartialType(PaginationFiltersDto) {

}