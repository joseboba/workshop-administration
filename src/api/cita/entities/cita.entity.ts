import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { UpdateCitaDto } from '../dto/update-cita.dto';
import { CreateCitaDto } from '../dto/create-cita.dto';

@Entity('taa_cita')
export class Cita {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'cta_codigo' })
  ctaCodigo: number;
  @ApiProperty()
  @Column({ name: 'cta_fecha_hora' })
  ctaFechaHora: Date;
  @ApiProperty()
  @Column({ name: 'cta_estado' })
  ctaEstado: boolean;
  @ApiProperty()
  @Column({ name: 'cta_descripcion' })
  ctaDescripcion: string;
  @ApiProperty()
  @Column({ name: 'cta_fecha_creacion' })
  ctaFechaCreacion: Date;
  @ApiProperty()
  @Column({ name: 'cta_duracion_estimada_min' })
  ctaDuracionEstimadaMin: number;
  @ApiProperty()
  @Column({ name: 'cta_confirmacion', default: false })
  ctaConfirmacion: boolean;
  @ApiProperty({ type: () => Vehiculo })
  @JoinColumn({ name: 'veh_placa' })
  @ManyToOne(() => Vehiculo, (entity) => entity.citas)
  vehiculo: Vehiculo;

  public static fromUpdateDto(
    updateDto: UpdateCitaDto,
  ): Cita {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateCitaDto,
  ): Cita {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Cita {
    const cita = new Cita();
    Object.assign(cita, source);
    return cita;
  }
}
