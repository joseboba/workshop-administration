import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrdenTrabajoDto {
  @ApiProperty()
  @MaxLength(250, { message: '' })
  @NotEmptyText({ message: 'Detalle de estado previo es requerido' })
  detalleEstadoPrevio: string;
  @IsNotEmpty()
  @ApiProperty()
  diasGarantia: number;
  @IsNotEmpty()
  @ApiProperty()
  tallCodigo: number;
  @IsNotEmpty()
  @ApiProperty()
  ctaCodigo: number;
  @ApiProperty()
  ortFechaEntrega: Date;
}
