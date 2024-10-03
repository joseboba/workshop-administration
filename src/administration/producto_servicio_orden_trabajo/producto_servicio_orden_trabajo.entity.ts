import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('taa_producto_servicio_orden_trabajo')
export class ProductoServicioOrdenTrabajo {
  @Column({ name: 'pro_codigo' })
  @PrimaryColumn({ name: 'pro_codigo' })
  @ApiProperty()
  proCodigo: number;
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
  proNombre: string;
  @Exclude()
  @ApiProperty()
  proPrecio: number;
}
