import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Constants } from '../../../util/constants';
import { NotEmptyText } from '../../../config';

export class CreateCitaDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: Constants.requiredError('Fecha de la cita') })
  ctaFechaHora: Date;
  @ApiProperty()
  @IsBoolean()
  ctaEstado: boolean;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripcion') })
  @MaxLength(250, { message: Constants.maxLengthError('Descripcion', 250) })
  ctaDescripcion: string;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Duración estimada') })
  ctaDuracionEstimadaMin: number;
  @ApiProperty()
  @IsBoolean()
  ctaConfirmacion: boolean;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Placa') })
  @MaxLength(20, { message: Constants.maxLengthError('Placa', 20) })
  vehPlaca: string;
}
