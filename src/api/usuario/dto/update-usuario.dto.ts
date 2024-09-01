import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBoolean } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  usrCodigo: number;
  @ApiProperty()
  @IsBoolean()
  usrEstado: boolean;
}
