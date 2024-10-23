import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DatesFiltersDto } from './dates-filters.dto';
import { Type } from 'class-transformer';

export class ServiciosMasMenosCarosDto extends PartialType(
  DatesFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => Number)
  tipoServicio: number | null;
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => Number)
  mecanico: number | null;
}
