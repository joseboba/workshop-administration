import { CreateMarcaEquipoDto } from '../dto/create-marca_equipo.dto';
import { UpdateMarcaEquipoDto } from '../dto/update-marca_equipo.dto';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EquipoTaller } from '../../equipo_taller/entities/equipo_taller.entity';

@Entity('taa_marca_equipo')
export class MarcaEquipo {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'meq_codigo' })
  meqCodigo: number;
  @ApiProperty()
  @Column({ name: 'meq_nombre' })
  meqNombre: string;
  @ApiProperty()
  @Column({ name: 'meq_descripcion' })
  meqDescripcion: string;
  @JoinColumn({ name: 'meq_codigo' })
  @OneToMany(() => EquipoTaller, (entity) => entity.marcaEquipo)
  equiposTaller: EquipoTaller[];

  public static fromUpdateDto(updateDto: UpdateMarcaEquipoDto): MarcaEquipo {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(createDto: CreateMarcaEquipoDto): MarcaEquipo {
    return this.parseDto(createDto);
  }

  private static parseDto(source): MarcaEquipo {
    const marcaVehiculo = new MarcaEquipo();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
