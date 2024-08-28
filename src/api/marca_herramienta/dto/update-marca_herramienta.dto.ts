import { PartialType } from '@nestjs/swagger';
import { CreateMarcaHerramientaDto } from './create-marca_herramienta.dto';

export class UpdateMarcaHerramientaDto extends PartialType(CreateMarcaHerramientaDto) {
  mheCodigo: number;
}
