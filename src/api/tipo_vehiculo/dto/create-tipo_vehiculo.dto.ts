import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { MaxLength } from 'class-validator';

export class CreateTipoVehiculoDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  tveNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripción') })
  @MaxLength(50, { message: Constants.maxLengthError('Descripción', 50) })
  tveDescripcion: string;
}
