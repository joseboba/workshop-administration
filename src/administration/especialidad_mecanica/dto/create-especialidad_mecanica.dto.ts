import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { MaxLength } from 'class-validator';

export class CreateEspecialidadMecanicaDto {
  @ApiProperty()
  @NotEmptyText({ message: 'Nombre es requerido' })
  @MaxLength(50, { message: 'El nombre debe ser de máximo 50 cáracteres' })
  emeNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: 'Descripción es requerida' })
  @MaxLength(150, { message: 'La descripción debe ser de máximo 50 cáracteres' })
  emeDescripcion: string;
}
