import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoServicioDto {
  @ApiProperty()
  tsrNombre: string;
  @ApiProperty()
  tsrDescripcion: string;
  @ApiProperty()
  tsrEstado: boolean;
}
