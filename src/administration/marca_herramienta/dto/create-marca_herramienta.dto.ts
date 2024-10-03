import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { MaxLength } from 'class-validator';

export class CreateMarcaHerramientaDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  mheNombre: string;
}
