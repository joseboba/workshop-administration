import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsDate, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiasNoDisponibleDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Motivo') })
  @MaxLength(150, { message: Constants.maxLengthError('Motivo', 50) })
  dndMotivo: string;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dndFecha: Date;
  @ApiProperty()
  @IsNotEmpty()
  tllCodigo: number;
}
