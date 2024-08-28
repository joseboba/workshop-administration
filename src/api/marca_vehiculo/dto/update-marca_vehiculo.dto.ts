import { PartialType } from '@nestjs/swagger';
import { CreateMarcaVehiculoDto } from './create-marca_vehiculo.dto';

export class UpdateMarcaVehiculoDto extends PartialType(CreateMarcaVehiculoDto) {
  mveCodigo: number;
}
