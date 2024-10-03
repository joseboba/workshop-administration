import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateHerramientaDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  herNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripcion') })
  @MaxLength(150, { message: Constants.maxLengthError('Descripcion', 150) })
  herDescripcion: string;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Condicion') })
  herCondicion: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Mecanico') })
  mecCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Marca Herramienta') })
  mheCodigo: number;
}
