import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { Constants } from '../../../util/constants';
import { NotEmptyText } from '../../../config';

export class CreateMarcaEquipoDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  meqNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripcion') })
  @MaxLength(150, { message: Constants.maxLengthError('Descripcion', 50) })
  meqDescripcion: string;
}
