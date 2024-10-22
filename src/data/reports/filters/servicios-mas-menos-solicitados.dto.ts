import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DatesFiltersDto } from './dates-filters.dto';
import { Type } from 'class-transformer';

export class ServiciosMasMenosSolicitadosDto extends PartialType(
  DatesFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => Number)
  tipoServicio: number | null;
}
