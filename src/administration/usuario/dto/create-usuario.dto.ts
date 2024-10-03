import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { MaxLength, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Contraseña') })
  @MaxLength(15,{ message: Constants.maxLengthError('Contraseña', 15) })
  @MinLength(8, { message: 'La contraseña debe ser de mínimo 8 cáracteres' })
  usrContrasenia: string;
  @ApiProperty()
  usrAdministrador: boolean;
  @ApiProperty()
  mecCodigo: number;
  @ApiProperty()
  cliCodigo: number;
}
