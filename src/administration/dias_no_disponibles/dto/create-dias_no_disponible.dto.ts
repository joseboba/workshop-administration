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
  @ApiProperty({
    example: '13:59:59 12-31-2024',
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dndFecha: Date;
  @ApiProperty()
  @IsNotEmpty()
  tllCodigo: number;
}
