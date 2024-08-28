import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Constants } from '../../../util/constants';

export class CreateServicioRepuestoDto {
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Cantidad') })
  @IsNumber()
  srrCantidad: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Subtotal') })
  @IsNumber()
  srrSubtotal: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Servicio') })
  @IsNumber()
  srvCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Repuesto') })
  @IsNumber()
  repCodigo: number;
}
