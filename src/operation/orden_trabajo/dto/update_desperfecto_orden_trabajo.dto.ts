import { ApiProperty } from '@nestjs/swagger';

export class UpdateDesperfectoOrdenTrabajoDto {
  @ApiProperty()
  ortCodigo: number;
  @ApiProperty()
  desperfecto: string;
}
