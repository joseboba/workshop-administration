import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTipoPagoDto, UpdateTipoPagoDto } from '../dto';
import { Pago } from '../../../operation/payment/entities/pago.entity';

@Entity('taa_tipo_pago')
export class TipoPago {
  @ApiProperty()
  @PrimaryColumn({ name: 'tpa_codigo' })
  tpaCodigo: number;
  @ApiProperty()
  @Column({ name: 'tpa_nombre' })
  tpaNombre: string;
  @OneToMany(() => Pago, (entity) => entity.tipoPago)
  @JoinColumn({ name: 'tpa_codigo' })
  pagos: Pago[];

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
