import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DatesFiltersDto } from './dates-filters.dto';
import { Type } from 'class-transformer';

export class MarcasMasAtendidasDto extends PartialType(
  DatesFiltersDto,
) {
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de tipo vehiculo',
  })
  @Type(() => Number)
  tipoVehiculo: number | null;
  @ApiProperty({
    required: false,
    description: 'Filtro de tipo de tipo vehiculo',
  })
  @Type(() => Number)
  marca: number | null;
}
