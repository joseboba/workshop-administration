import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServicioDto {
  @ApiProperty()
  srvCodigo: number;
  @ApiProperty()
  @NotEmptyText({
    message: 'El nombre no puede estar vacío',
  })
  @MinLength(1, {
    message: 'El nombre debe ser de al menos 1 cáracter',
  })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  srvNombre: string;
  @ApiProperty()
  @NotEmptyText({
    message: 'El nombre no puede estar vacío',
  })
  @MinLength(1, {
    message: 'El nombre debe ser de al menos 1 cáracter',
  })
  @MaxLength(200, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  srvDescripcion: string;
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El costo debe ser un número' })
  @Min(1, { message: 'El valor mínimo de costo es 1' })
  @IsNotEmpty()
  srvCosto: number;
  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El costo de repuesto debe ser un número' },
  )
  srvCostoRepuestos: number;
  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El costo de productos debe ser un número' },
  )
  srvCostoProductos: number;
  @ApiProperty()
  @IsBoolean()
  srvEstado: boolean;
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  tsrCodigo: number;
}
