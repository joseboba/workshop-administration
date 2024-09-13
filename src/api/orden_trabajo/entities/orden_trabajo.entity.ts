import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Taller } from '../../taller/entities/taller.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Cita } from '../../cita/entities/cita.entity';
import { ServicioOrdenTrabajo } from '../../servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';

@Entity('taa_orden_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn({ name: 'ort_codigo' })
  ortCodigo: number;
  @Column({ name: 'ort_fecha_inicio' })
  ortFechaInicio: Date;
  @Column({ name: 'ort_detalle_estado_previo' })
  ortEstadoPrevio: string;
  @Column({ name: 'ort_fecha_entrega' })
  ortFechaEntrega: Date;
  @Column({ name: 'ort_dias_garantia' })
  ortDiasGarantia: number;
  @ManyToOne(() => Taller, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'tll_codigo' })
  taller: Taller;
  @ManyToOne(() => Vehiculo, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'veh_placa' })
  vehiculo: Vehiculo;
  @ManyToOne(() => Cita, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'cta_codigo' })
  cita: Cita;
  @OneToMany(() => ServicioOrdenTrabajo, (entity) => entity.ordenTrabajo)
  @JoinColumn({ name: 'ort_codigo' })
  serviciosOrdenTrabajo: ServicioOrdenTrabajo[];
}
