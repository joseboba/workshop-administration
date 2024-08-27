import { PartialType } from '@nestjs/swagger';
import { CreateMecanicoDto } from './create-mecanico.dto';

export class UpdateMecanicoDto extends PartialType(CreateMecanicoDto) {}
