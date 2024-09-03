import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';


export class CitaPaginationFiltersDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por coincidencia de descripción',
  })
  @IsString()
  search: string;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de creación',
  })
  @Type(() => Date)
  @IsDate()
  inicioFechaCreacion: Date | null;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de creación',
  })
  @Type(() => Date)
  @IsDate()
  finFechaCreacion: Date | null;
}