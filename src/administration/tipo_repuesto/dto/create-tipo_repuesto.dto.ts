import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { MaxLength } from 'class-validator';

export class CreateTipoRepuestoDto {
  @ApiProperty()
  @NotEmptyText({ message: 'El nombre es requerido' })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  trpNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: 'La descripción es requerida' })
  @MaxLength(50, {
    message: 'La descripción debe ser de máximo 50 cáracteres',
  })
  trpDescripcion: string;
}
