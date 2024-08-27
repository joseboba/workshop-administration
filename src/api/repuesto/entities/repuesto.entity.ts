import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { TipoRepuesto } from '../../tipo_repuesto/entities/tipo_repuesto.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRepuestoDto, UpdateRepuestoDto } from '../dto';

@Entity('taa_repuesto')
export class Repuesto {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'rep_codigo' })
  repCodigo: number;
  @ApiProperty()
  @Column({ name: 'rep_nombre' })
  repNombre: string;
  @ApiProperty()
  @Column({ name: 'rep_descripcion' })
  repDescripcion: string;
  @ApiProperty()
  @Column({ name: 'rep_original' })
  repOriginal: boolean;
  @ApiProperty()
  @Column({ name: 'rep_precio' })
  repPrecio: number;
  @ApiProperty()
  @Column({ name: 'rep_cantidad_disponible' })
  repCantidadDisponible: number;
  @ApiProperty({ type: () => Proveedor })
  @ManyToOne(() => Proveedor, (entity) => entity.repuestos)
  @JoinColumn({ name: 'prv_codigo' })
  proveedor: Proveedor;
  @ApiProperty({ type: () => TipoRepuesto })
  @ManyToOne(() => TipoRepuesto, (entity) => entity.repuestos)
  @JoinColumn({ name: 'trp_codigo' })
  tipoRepuesto: TipoRepuesto;

  public static fromUpdateDto(updateDto: UpdateRepuestoDto): Repuesto {
    const repuesto = new Repuesto();
    Object.assign(repuesto, updateDto);
    return repuesto;
  }

  public static fromCreateDto(createDto: CreateRepuestoDto): Repuesto {
    const repuesto = new Repuesto();
    Object.assign(repuesto, createDto);
    return repuesto;
  }
}
