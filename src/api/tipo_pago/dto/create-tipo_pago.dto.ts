import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { NotEmptyText } from '../../../config';

export class CreateTipoPagoDto {
  @ApiProperty()
  @NotEmptyText({ message: 'El nombre es requerido' })
  @MaxLength(50, { message: 'El nombre puede ser máximo de 50 cáracteres' })
  tpaNombre: string;
}
