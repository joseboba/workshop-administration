import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('taa_respuesto_servicio_orden_trabajo')
export class RepuestoServicioOrdenTrabajo {
  @Column({ name: 'rep_codigo' })
  @PrimaryColumn({ name: 'rep_codigo' })
  @ApiProperty()
  repCodigo: number;
  @Column({ name: 'sor_codigo' })
  @PrimaryColumn({ name: 'sor_codigo' })
  @ApiProperty()
  sorCodigo: number;
  @Column({ name: 'cantidad' })
  @ApiProperty()
  cantidad: number;
  @Column({ name: 'fecha' })
  @ApiProperty()
  fecha: Date;
  @Exclude()
  @ApiProperty()
  repNombre: string;
  @Exclude()
  @ApiProperty()
  repPrecio: number;
}
