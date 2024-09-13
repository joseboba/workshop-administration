import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { OrdenTrabajo } from '../../orden_trabajo/entities/orden_trabajo.entity';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';

@Entity('taa_servicio_orden_trabajo')
export class ServicioOrdenTrabajo {
  @PrimaryGeneratedColumn({ name: 'sor_codigo' })
  sorCodigo: number;
  @Column({ name: 'sor_fecha_servicio' })
  sorFechaServicio: Date;
  @Column({ name: 'sor_detalle_estado_previo' })
  sorDetalleEstadoPrevio: string;
  @Column({ name: 'sor_estado_servicio' })
  sorEstadoServicio: number;
  @Column({ name: 'sor_fecha_entrega' })
  sorFechaEntrega: Date;
  @Column({ name: 'sor_dias_garantia' })
  sorDiasGarantia: number;
  @JoinColumn({ name: 'srv_codigo' })
  @ManyToOne(() => Servicio, (entity) => entity.serviciosOrdenTrabajo)
  servicio: Servicio;
  @JoinColumn({ name: 'ort_codigo' })
  @ManyToOne(() => OrdenTrabajo, (entity) => entity.serviciosOrdenTrabajo)
  ordenTrabajo: OrdenTrabajo;
  @JoinColumn({ name: 'mec_codigo' })
  @ManyToOne(() => Mecanico, (entity) => entity.serviciosOrdenTrabajo)
  mecanico: Mecanico;
}
