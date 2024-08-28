import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVehiculoDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Placa') })
  @MaxLength(10, { message: Constants.maxLengthError('Placa', 10) })
  vehPlaca: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Numero Chasis') })
  @MaxLength(20, { message: Constants.maxLengthError('Numero Chasis', 20) })
  vehNumeroChasis: string;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Modelo') })
  vheModelo: number;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Color') })
  @MaxLength(20, { message: Constants.maxLengthError('Color', 20) })
  vheColor: string;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Kilometraje') })
  vehKilometraje: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Cliente') })
  cliCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Marca Vehiculo') })
  mveCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Tipo Vehiculo') })
  tveCodigo: number;
}
