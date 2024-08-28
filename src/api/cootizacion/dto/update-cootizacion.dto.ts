import { PartialType } from '@nestjs/swagger';
import { CreateCootizacionDto } from './create-cootizacion.dto';

export class UpdateCootizacionDto extends PartialType(CreateCootizacionDto) {}
