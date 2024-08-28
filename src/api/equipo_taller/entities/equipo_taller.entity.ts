import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';
import { MarcaEquipo } from '../../marca_equipo/entities/marca_equipo.entity';

@Entity('taa_equipo_taller')
export class EquipoTaller {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'eta_codigo' })
  etaCodigo: number;
  @ApiProperty()
  @Column({ name: 'eta_nombre' })
  etaNombre: string;
  @ApiProperty()
  @Column({ name: 'eta_descripcion' })
  etaDescripcion: string;
  @ApiProperty()
  @Column({ name: 'eta_modelo' })
  etaModelo: string;
  @ApiProperty()
  @Column({ name: 'eta_fecha_ingreso' })
  etaFechaIngreso: Date;
  @ApiProperty()
  @Column({ name: 'eta_estado' })
  etaEstado: number;
  @ApiProperty({ type: () => Mecanico })
  @JoinColumn({ name: 'mec_codigo' })
  @ManyToOne(() => Mecanico, (entity) => entity.equiposTaller)
  mecanico: Mecanico;
  @ApiProperty({ type: () => MarcaEquipo })
  @JoinColumn({ name: 'meq_codigo' })
  @ManyToOne(() => MarcaEquipo, (entity) => entity.equiposTaller)
  marcaEquipo: MarcaEquipo;

}
