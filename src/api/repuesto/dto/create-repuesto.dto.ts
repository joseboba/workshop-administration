import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { NotEmptyText } from '../../../config';

export class CreateRepuestoDto {
  @ApiProperty()
  @NotEmptyText({ message: 'El nombre es requerido' })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  repNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: 'La descripción es requerido' })
  @MaxLength(150, {
    message: 'La descripción debe ser de máximo 150 cáracteres',
  })
  repDescripcion: string;
  @ApiProperty()
  @IsNotEmpty({
    message: 'Es requerido el campo origial'
  })
  @IsBoolean()
  repOriginal: boolean;
  @ApiProperty()
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber()
  repPrecio: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'La cantidad disponible es requerida' })
  @IsNumber()
  repCantidadDisponible: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'El proveedor es requerido' })
  prvCodigo: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'El tipo de repuesto es requerido' })
  trpCodigo: number;
}
