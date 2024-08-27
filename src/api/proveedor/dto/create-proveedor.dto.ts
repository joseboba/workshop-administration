import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty()
  @NotEmptyText({
    message: 'El nombre es requerido',
  })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  prvNombre: string;
  @ApiProperty()
  @NotEmptyText({
    message: 'El nombre de contacto es requerido',
  })
  @MaxLength(50, {
    message: 'El nombre de contacto debe ser de máximo 50 cáracteres',
  })
  prvNombreContacto: string;
  @ApiProperty()
  prvTelefono: string;
  @ApiProperty()
  prvCorreo: string;
  @ApiProperty()
  prvEstado: boolean;
}
