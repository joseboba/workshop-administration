import { PartialType } from '@nestjs/swagger';
import { CreateMarcaEquipoDto } from './create-marca_equipo.dto';

export class UpdateMarcaEquipoDto extends PartialType(CreateMarcaEquipoDto) {
  meqCodigo: number;
}
