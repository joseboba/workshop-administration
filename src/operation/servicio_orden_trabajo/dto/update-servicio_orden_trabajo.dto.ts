import { ApiProperty } from '@nestjs/swagger';

export class UpdateServicioOrdenTrabajoDto {
  @ApiProperty()
  detalleEstadoPrevio: string;
  @ApiProperty()
  diasGarantia: number;
  @ApiProperty()
  ortFechaEntrega: Date;
}
