import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Constants } from '../../../util/constants';

export class CreateServicioRepuestoDto {
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Cantidad') })
  @IsNumber()
  @IsPositive()
  srrCantidad: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Subtotal') })
  @IsNumber()
  @IsPositive()
  srrSubtotal: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Servicio') })
  @IsNumber()
  @IsPositive()
  srvCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Repuesto') })
  @IsNumber()
  @IsPositive()
  repCodigo: number;
}
