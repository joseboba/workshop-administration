import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, MaxLength, MinLength } from 'class-validator';
import { NotEmptyText } from '../../../config';

export class CreateTipoServicioDto {
  @ApiProperty()
  @NotEmptyText({
    message: 'El nombre no puede estar vacío',
  })
  @MinLength(1, {
    message: 'El nombre debe ser de al menos 1 cáracter',
  })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  tsrNombre: string;
  @ApiProperty()
  @NotEmptyText({
    message: 'La descripción no puede estar vacía',
  })
  @MinLength(1, {
    message: 'La descripción debe ser de al menos 10 cáracter',
  })
  @MaxLength(50, {
    message: 'La descripción debe ser de máximo 150 cáracteres',
  })
  tsrDescripcion: string;
  @ApiProperty()
  @IsBoolean()
  tsrEstado: boolean;
}
