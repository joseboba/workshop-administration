import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class DatesFiltersDto {

  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas',
  })
  @Type(() => Date)
  startDate: Date | null;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas',
  })
  @Type(() => Date)
  endDate: Date | null;

}