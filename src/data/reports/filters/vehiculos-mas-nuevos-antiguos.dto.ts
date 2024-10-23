import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DatesFiltersDto } from './dates-filters.dto';
import { Type } from 'class-transformer';

export class VehiculosMasNuevosAntiguosDto extends PartialType(
  DatesFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => Number)
  tipoVehiculo: number | null;
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => Number)
  cliente: number | null;
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de servicio',
  })
  @Type(() => String)
  placa: string | null;
}
