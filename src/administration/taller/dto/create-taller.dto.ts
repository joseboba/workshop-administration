import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsEmail, MaxLength } from 'class-validator';

export class CreateTallerDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  tllNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Telefono') })
  @MaxLength(15, { message: Constants.maxLengthError('Telefono', 15) })
  tllTelefono: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Direccion') })
  @MaxLength(200, { message: Constants.maxLengthError('Direccion', 200) })
  tllDireccion: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Correo') })
  @MaxLength(20, { message: Constants.maxLengthError('Correo', 20) })
  @IsEmail({}, { message: 'Correo inválido' })
  tllCorreo: string;
}
