import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { Constants } from '../../../util/constants';
import { NotEmptyText } from '../../../config';

export class CreateMarcaVehiculoDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, {
    message: Constants.maxLengthError('Nombre', 50),
  })
  mveNombre: string;
}