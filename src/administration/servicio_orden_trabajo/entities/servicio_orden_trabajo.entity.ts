import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { OrdenTrabajo } from '../../orden_trabajo/entities/orden_trabajo.entity';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';
import { Exclude } from 'class-transformer';
import {
  ProductoServicioOrdenTrabajo,
} from '../../producto_servicio_orden_trabajo/producto_servicio_orden_trabajo.entity';
import {
  RepuestoServicioOrdenTrabajo,
} from '../../repuesto_servicio_orden_trabajo/repuesto_servicio_orden_trabajo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('taa_servicio_orden_trabajo')
export class ServicioOrdenTrabajo {
  @PrimaryGeneratedColumn({ name: 'sor_codigo' })
  @ApiProperty()
  sorCodigo: number;
  @Column({ name: 'sor_fecha_servicio' })
  @ApiProperty()
  sorFechaServicio: Date;
  @Column({ name: 'sor_detalle_estado_previo' })
  @ApiProperty()
  sorDetalleEstadoPrevio: string;
  @Column({ name: 'sor_estado_servicio' })
  @ApiProperty()
  sorEstadoServicio: string;
  @Column({ name: 'sor_fecha_entrega' })
  @ApiProperty()
  sorFechaEntrega: Date;
  @Column({ name: 'sor_dias_garantia' })
  @ApiProperty()
  sorDiasGarantia: number;
  @JoinColumn({ name: 'srv_codigo' })
  @ManyToOne(() => Servicio, (entity) => entity.serviciosOrdenTrabajo)
  @ApiProperty({ type: () => Servicio })
  servicio: Servicio;
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => OrdenTrabajo })
  @ManyToOne(() => OrdenTrabajo, (entity) => entity.serviciosOrdenTrabajo)
  ordenTrabajo: OrdenTrabajo;
  @JoinColumn({ name: 'mec_codigo' })
  @ManyToOne(() => Mecanico, (entity) => entity.serviciosOrdenTrabajo)
  @ApiProperty({ type: () => Mecanico })
  mecanico: Mecanico;
  @Exclude()
  @ApiProperty({ type: () => ProductoServicioOrdenTrabajo, isArray: true })
  productos: ProductoServicioOrdenTrabajo[];
  @Exclude()
  @ApiProperty({ type: () => RepuestoServicioOrdenTrabajo, isArray: true })
  repuestos: RepuestoServicioOrdenTrabajo[];
}
