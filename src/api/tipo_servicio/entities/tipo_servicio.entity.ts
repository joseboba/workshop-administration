import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTipoServicioDto, UpdateTipoServicioDto } from '../dto';
import { Servicio } from '../../servicio/entities/servicio.entity';

@Entity('taa_tipo_servicio')
export class TipoServicio {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tsr_codigo' })
  @ApiProperty()
  tsrCodigo: number;

  @Column({ name: 'tsr_nombre', type: 'varchar', length: 50, nullable: false })
  @ApiProperty()
  tsrNombre: string;

  @Column({
    name: 'tsr_descripcion',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  @ApiProperty()
  tsrDescripcion: string;

  @Column({
    name: 'tsr_estado',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  @ApiProperty()
  tsrEstado: boolean;
  @OneToMany(() => Servicio, (entity) => entity.tipoServicio)
  @JoinColumn({ name: 'tsr_codigo' })
  servicios: Servicio[];

  public static fromUpdateDto(updateDto: UpdateTipoServicioDto): TipoServicio {
    const tipoServicio = new TipoServicio();
    Object.assign(tipoServicio, updateDto);
    return tipoServicio;
  }

  public static fromCreateDto(createDto: CreateTipoServicioDto): TipoServicio {
    const tipoServicio = new TipoServicio();
    Object.assign(tipoServicio, createDto);
    return tipoServicio;
  }
}
