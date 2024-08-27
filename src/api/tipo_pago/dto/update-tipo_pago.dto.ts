import { PartialType } from '@nestjs/swagger';
import { CreateTipoPagoDto } from './create-tipo_pago.dto';

export class UpdateTipoPagoDto extends PartialType(CreateTipoPagoDto) {
  tpaCodigo: string;
}
