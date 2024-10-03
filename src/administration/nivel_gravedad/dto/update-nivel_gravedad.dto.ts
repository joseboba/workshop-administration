import { PartialType } from '@nestjs/swagger';
import { CreateNivelGravedadDto } from './create-nivel_gravedad.dto';

export class UpdateNivelGravedadDto extends PartialType(CreateNivelGravedadDto) {
  ngrCodigo: number;
}
