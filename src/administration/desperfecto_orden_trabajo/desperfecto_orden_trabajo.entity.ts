import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrdenTrabajo } from '../orden_trabajo/entities/orden_trabajo.entity';
import { OrdenTrabajoService } from '../../operation/orden_trabajo/orden_trabajo.service';

@Entity('taa_desperfecto_orden_trabajo')
export class DesperfectoOrdenTrabajo {
  @PrimaryGeneratedColumn({ name: 'dsor_codigo' })
  @ApiProperty()
  dsorCodigo: number;
  @Column({ name: 'ort_codigo' })
  @Column({ name: 'dsor_desperfecto' })
  @ApiProperty()
  dsorDesperfecto: string;
  @JoinColumn({ name: 'ort_codigo' })
  @ApiProperty({ type: () => OrdenTrabajo })
  @ManyToOne(() => OrdenTrabajo, entity => entity.desperfectos)
  ordenTrabajo: OrdenTrabajo;
}
