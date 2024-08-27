import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTipoPagoDto, UpdateTipoPagoDto } from '../dto';

@Entity('taa_tipo_pago')
export class TipoPago {
  @ApiProperty()
  @PrimaryColumn({ name: 'tpa_codigo' })
  tpaCodigo: string;
  @ApiProperty()
  @Column({ name: 'tpa_nombre' })
  tpaNombre: string;

  public static fromUpdateDto(updateDto: UpdateTipoPagoDto): TipoPago {
    const tipoPago = new TipoPago();
    Object.assign(tipoPago, updateDto);
    return tipoPago;
  }

  public static fromCreateDto(createDto: CreateTipoPagoDto): TipoPago {
    const tipoPago = new TipoPago();
    Object.assign(tipoPago, createDto);
    return tipoPago;
  }
}
