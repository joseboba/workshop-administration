import { ApiProperty } from '@nestjs/swagger';

export class ApplyPaymentDto {
  @ApiProperty()
  pagReferencia: string;
  @ApiProperty()
  pagNumeroAutorizacion: string;
  @ApiProperty()
  pagDocumentoPago: string;
  @ApiProperty()
  pagTotal: number;
  @ApiProperty()
  tpaCodigo: number;
  @ApiProperty()
  ortCodigo: number;
}
