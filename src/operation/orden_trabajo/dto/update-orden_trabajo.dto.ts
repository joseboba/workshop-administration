import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdenTrabajoDto {
  @ApiProperty()
  detalleEstadoPrevio: string;
  @ApiProperty()
  diasGarantia: number;
  @ApiProperty()
  ortFechaEntrega: Date;
}
