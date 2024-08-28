import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsDate, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEquipoTallerDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  @MaxLength(50, { message: Constants.maxLengthError('Nombre', 50) })
  etaNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripcion') })
  @MaxLength(150, { message: Constants.maxLengthError('Descripcion', 150) })
  etaDescripcion: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Modelo') })
  @MaxLength(50, { message: Constants.maxLengthError('Modelo', 50) })
  etaModelo: string;
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: Constants.requiredError('Fecha ingreso') })
  etaFechaIngreso: Date;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Estado') })
  @IsNumber()
  etaEstado: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Mecanico') })
  mecCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Marca Equipo') })
  meqCodigo: number;
}
