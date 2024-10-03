import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';
import { Type } from 'class-transformer';

export class ServicioOrdenTrabajoPaginationFilterDto extends PartialType(PaginationFiltersDto) {
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de servicio',
  })
  @Type(() => Date)
  inicioFechaServicio: Date | null;
  @ApiProperty({
    required: false,
    description: 'Busqueda por rango de fechas de servicio',
  })
  @Type(() => Date)
  finFechaServicio: Date | null;
  @ApiProperty({
    required: false,
    description: 'Filtrar por orden de trabajo',
  })
  @Type(() => Number)
  ortCodigo?: number;
  @ApiProperty({
    required: false,
    description: 'Filtrar por servicio',
  })
  @Type(() => Number)
  srvCodigo?: number;
  @ApiProperty({
    required: false,
    description: 'Filtrar por mecanico',
  })
  @Type(() => Number)
  mecCodigo?: number;
}