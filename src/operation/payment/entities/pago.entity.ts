import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoPago } from '../../../administration/tipo_pago/entities/tipo_pago.entity';
import { OrdenTrabajo } from '../../../administration/orden_trabajo/entities/orden_trabajo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('taa_pago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'pag_codigo' })
  @ApiProperty()
  pagCodigo: number;
  @Column({ name: 'pag_fecha' })
  @ApiProperty()
  pagFecha: Date;
  @Column({ name: 'pag_referencia' })
  @ApiProperty()
  pagReferencia: string;
  @Column({ name: 'pag_numero_autorizacion' })
  @ApiProperty()
  pagNumeroAutorizacion: string;
  @Column({ name: 'pag_documento_pago' })
  @ApiProperty()
  pagDocumentoPago: string;
  @Column({ name: 'pag_total' })
  @ApiProperty()
  pagTotal: number;
  @ManyToOne(() => TipoPago, (entity) => entity.pagos)
  @JoinColumn({ name: 'tpa_codigo' })
  @ApiProperty({ type: () => TipoPago })
  tipoPago: TipoPago;
  @ManyToOne(() => OrdenTrabajo, (entity) => entity.pagos)
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => OrdenTrabajo })
  ordenTrabajo: OrdenTrabajo;
}
