import { PartialType } from '@nestjs/swagger';
import { CreateServicioRepuestoDto } from './create-servicio_repuesto.dto';

export class UpdateServicioRepuestoDto extends PartialType(CreateServicioRepuestoDto) {
  srrCodigo: number;
}
