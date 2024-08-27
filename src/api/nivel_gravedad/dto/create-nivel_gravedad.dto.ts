import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, MaxLength } from 'class-validator';
import { NotEmptyText } from '../../../config';

export class CreateNivelGravedadDto {
  @ApiProperty()
  @NotEmptyText({ message: 'El nombre es requerido' })
  @MaxLength(50, {
    message: 'El nombre debe ser de máximo 50 cáracteres',
  })
  ngrNombre: string;
  @ApiProperty()
  @NotEmptyText({ message: 'El detalle es requerido' })
  @MaxLength(50, {
    message: 'El detalle debe ser de máximo 50 cáracteres',
  })
  ngrDetalle: string;
  @ApiProperty()
  @IsBoolean()
  ngrEstado: boolean;
}
