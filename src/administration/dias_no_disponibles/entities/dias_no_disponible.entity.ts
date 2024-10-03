import { Taller } from '../../taller/entities/taller.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDiasNoDisponibleDto } from '../dto/create-dias_no_disponible.dto';
import { UpdateDiasNoDisponibleDto } from '../dto/update-dias_no_disponible.dto';

@Entity('taa_dias_no_disponibles')
export class DiasNoDisponible {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'dnd_codigo' })
  dndCodigo: number;
  @ApiProperty()
  @Column({ name: 'dnd_motivo' })
  dndMotivo: string;
  @ApiProperty()
  @Column({ name: 'dnd_fecha' })
  dndFecha: Date;
  @ApiProperty({ type: () => Taller })
  @ManyToOne(() => Taller, (entity) => entity.diasNoDisponibles)
  @JoinColumn({ name: 'tll_codigo' })
  taller: Taller;

  public static fromUpdateDto(
    updateDto: UpdateDiasNoDisponibleDto,
  ): DiasNoDisponible {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateDiasNoDisponibleDto,
  ): DiasNoDisponible {
    return this.parseDto(createDto);
  }

  private static parseDto(source): DiasNoDisponible {
    const marcaVehiculo = new DiasNoDisponible();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
