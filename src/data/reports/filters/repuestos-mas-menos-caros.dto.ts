import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DatesFiltersDto } from './dates-filters.dto';
import { Type } from 'class-transformer';

export class RepuestosMasMenosCarosDto extends PartialType(
  DatesFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Filtro de proveedor',
  })
  @Type(() => Number)
  proveedor: number | null;
  @ApiProperty({
    required: false,
    description: 'Filtro de proveedor',
  })
  @Type(() => Number)
  tipoRepuesto: number | null;
}
