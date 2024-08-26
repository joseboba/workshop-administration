import { PartialType } from '@nestjs/swagger';
import { CreateTipoServicioDto } from './create-tipo_servicio.dto';

export class UpdateTipoServicioDto extends PartialType(CreateTipoServicioDto) {}
