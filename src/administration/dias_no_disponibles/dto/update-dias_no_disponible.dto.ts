import { PartialType } from '@nestjs/swagger';
import { CreateDiasNoDisponibleDto } from './create-dias_no_disponible.dto';

export class UpdateDiasNoDisponibleDto extends PartialType(CreateDiasNoDisponibleDto) {
  dndCodigo: number;
}
