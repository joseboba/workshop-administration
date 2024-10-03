import { PartialType } from '@nestjs/swagger';
import { CreateTipoRepuestoDto } from './create-tipo_repuesto.dto';

export class UpdateTipoRepuestoDto extends PartialType(CreateTipoRepuestoDto) {
  trpCodigo: number;
}
