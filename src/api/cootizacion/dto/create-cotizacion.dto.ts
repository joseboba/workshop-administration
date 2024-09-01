import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Constants } from '../../../util/constants';
import { Type } from 'class-transformer';

export class CreateCotizacionDto {
  @ApiProperty()
  @IsDate()
  @Type(() =>  Date)
  @IsNotEmpty({ message: Constants.requiredError('Fecha de Vencimiento') })
  cotFechaVencimiento: Date;
  @ApiProperty()
  @IsBoolean()
  cotVigente: boolean;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: Constants.requiredError('Subtotal') })
  cotSubtotal: number;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cotDescuento: number;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: Constants.requiredError('Total') })
  cotTotal: number;
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: Constants.requiredError('Cliente') })
  cliCodigo: number;
}
