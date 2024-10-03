import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { IsNotEmpty } from 'class-validator';

export class CreateServicioOrdenTrabajoDto {
  @ApiProperty()
  @NotEmptyText({ message: 'Detalle estado previo es requerido' })
  estadoPrevio: string;
  @ApiProperty()
  @IsNotEmpty()
  fechaEntrega: Date;
  @ApiProperty()
  @IsNotEmpty()
  diasGarantia: number;
  @ApiProperty()
  @IsNotEmpty()
  srvCodigo: number;
  @ApiProperty()
  @IsNotEmpty()
  ortCodigo: number;
  @ApiProperty()
  @IsNotEmpty()
  mecCodigo: number;
}
