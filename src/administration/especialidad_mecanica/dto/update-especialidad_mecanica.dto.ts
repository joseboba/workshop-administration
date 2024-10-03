import { PartialType } from '@nestjs/swagger';
import { CreateEspecialidadMecanicaDto } from './create-especialidad_mecanica.dto';

export class UpdateEspecialidadMecanicaDto extends PartialType(CreateEspecialidadMecanicaDto) {
  emeCodigo: number;
}
