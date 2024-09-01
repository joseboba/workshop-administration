import { ApiProperty } from '@nestjs/swagger';
import { NotEmptyText } from '../../../config';
import { Constants } from '../../../util/constants';
import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Nombre') })
  proNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: Constants.requiredError('Descripcion') })
  proDescripcion: string;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Precio Compra') })
  @IsNumber()
  @IsPositive()
  proPrecioCompra: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Cantidad Disponible') })
  @IsNumber()
  @IsPositive()
  proCantidadDisponible: number;
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: Constants.requiredError('Fecha Ingreso') })
  proFechaInrgeso: Date;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Proveedor') })
  prvCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: Constants.requiredError('Marca Equipo') })
  mapCodigo: number;
}
