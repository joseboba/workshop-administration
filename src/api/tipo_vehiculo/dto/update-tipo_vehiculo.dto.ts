import { PartialType } from '@nestjs/swagger';
import { CreateTipoVehiculoDto } from './create-tipo_vehiculo.dto';

export class UpdateTipoVehiculoDto extends PartialType(CreateTipoVehiculoDto) {
  tveCodigo: number;
}
