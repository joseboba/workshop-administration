import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';
import { NotEmptyText } from '../../../config';

export class CreateClienteDto {
  @ApiProperty()
  @NotEmptyText({ message: 'El DPI es requerido' })
  @MaxLength(15, { message: 'El DPI puede ser máximo de 15 cáracteres' })
  cliDpi: string;
  @ApiProperty()
  @NotEmptyText({ message: 'El nombre es requerido' })
  @MaxLength(50, { message: 'El nombre puede ser máximo de 50 cáracteres' })
  cliNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: 'El apellido es requerido' })
  @MaxLength(50, { message: 'El apellido puede ser máximo de 50 cáracteres' })
  cliApellidos: string;
  @ApiProperty()
  @NotEmptyText({ message: 'El NIT es requerido' })
  @MaxLength(15, { message: 'El NIT puede ser máximo de 15 cáracteres' })
  cliNit: string;
  @ApiProperty()
  cliTelefono: string;
  @ApiProperty()
  @NotEmptyText({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'Correo inválido' })
  cliCorreo: string;
}
