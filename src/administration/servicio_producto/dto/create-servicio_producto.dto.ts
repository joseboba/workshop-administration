import { ApiProperty } from '@nestjs/swagger';

export class CreateServicioProductoDto {

  @ApiProperty()
  srpCantidad: number;
  @ApiProperty()
  srpSubtotal: number;
  @ApiProperty()
  srvCodigo: number;
  @ApiProperty()
  proCodigo: number;

}
