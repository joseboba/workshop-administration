import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTipoRepuestoDto, UpdateTipoRepuestoDto } from '../dto';
import { Repuesto } from '../../repuesto/entities/repuesto.entity';

@Entity('taa_tipo_repuesto')
export class TipoRepuesto {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'trp_codigo' })
  trpCodigo: number;
  @ApiProperty()
  @Column({ name: 'trp_nombre' })
  trpNombre: string;
  @ApiProperty()
  @Column({ name: 'trp_descripcion' })
  trpDescripcion: string;
  @OneToMany(() => Repuesto, (entity) => entity.tipoRepuesto)
  @JoinColumn({ name: 'trp_codigo' })
  repuestos: Repuesto[];

  public static fromUpdateDto(updateDto: UpdateTipoRepuestoDto): TipoRepuesto {
    const tipoRepuesto = new TipoRepuesto();
    Object.assign(tipoRepuesto, updateDto);
    return tipoRepuesto;
  }

  public static fromCreateDto(createDto: CreateTipoRepuestoDto): TipoRepuesto {
    const tipoRepuesto = new TipoRepuesto();
    Object.assign(tipoRepuesto, createDto);
    return tipoRepuesto;
  }
}
