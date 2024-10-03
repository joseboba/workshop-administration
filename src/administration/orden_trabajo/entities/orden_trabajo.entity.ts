import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Taller } from '../../taller/entities/taller.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Cita } from '../../cita/entities/cita.entity';
import { ServicioOrdenTrabajo } from '../../servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import { Pago } from '../../../operation/payment/entities/pago.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DesperfectoOrdenTrabajo } from '../../desperfecto_orden_trabajo/desperfecto_orden_trabajo.entity';

@Entity('taa_orden_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn({ name: 'ort_codigo' })
  @ApiProperty()
  ortCodigo: number;
  @Column({ name: 'ort_fecha_inicio' })
  @ApiProperty()
  ortFechaInicio: Date;
  @Column({ name: 'ort_detalle_estado_previo' })
  @ApiProperty()
  ortEstadoPrevio: string;
  @Column({ name: 'ort_fecha_entrega' })
  @ApiProperty()
  ortFechaEntrega: Date;
  @Column({ name: 'ort_dias_garantia' })
  @ApiProperty()
  ortDiasGarantia: number;
  @Column({ name: 'ort_status' })
  @ApiProperty()
  ortStatus: string;
  @ManyToOne(() => Taller, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'tll_codigo' })
  @ApiProperty({ type: () => Taller })
  taller: Taller;
  @ManyToOne(() => Vehiculo, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'veh_placa' })
  @ApiProperty({ type: () => Vehiculo })
  vehiculo: Vehiculo;
  @ManyToOne(() => Cita, (entity) => entity.ordenesTrabajo)
  @JoinColumn({ name: 'cta_codigo' })
  @ApiProperty({ type: () => Cita })
  cita: Cita;
  @OneToMany(() => ServicioOrdenTrabajo, (entity) => entity.ordenTrabajo)
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => ServicioOrdenTrabajo, isArray: true })
  serviciosOrdenTrabajo: ServicioOrdenTrabajo[];
  @OneToMany(() => Pago, (entity) => entity.ordenTrabajo)
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => Pago, isArray: true })
  pagos: Pago[];
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => DesperfectoOrdenTrabajo, isArray: true })
  @OneToMany(() => DesperfectoOrdenTrabajo, (entity) => entity.ordenTrabajo)
  desperfectos: DesperfectoOrdenTrabajo[];
}
