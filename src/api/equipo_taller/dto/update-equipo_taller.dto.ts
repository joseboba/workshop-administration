import { PartialType } from '@nestjs/swagger';
import { CreateEquipoTallerDto } from './create-equipo_taller.dto';

export class UpdateEquipoTallerDto extends PartialType(CreateEquipoTallerDto) {}
