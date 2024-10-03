import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMarcaVehiculoDto, UpdateMarcaVehiculoDto } from '../dto';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';

@Entity('taa_marca_vehiculo')
export class MarcaVehiculo {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'mve_codigo' })
  mveCodigo: number;
  @ApiProperty()
  @Column({ name: 'mve_nombre' })
  mveNombre: string;
  @JoinColumn({ name: 'mve_codigo' })
  @OneToMany(() => Vehiculo, (entity) => entity.marcaVehiculo)
  vehiculos: Vehiculo[];

  public static fromUpdateDto(
    updateDto: UpdateMarcaVehiculoDto,
  ): MarcaVehiculo {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateMarcaVehiculoDto,
  ): MarcaVehiculo {
    return this.parseDto(createDto);
  }

  private static parseDto(source): MarcaVehiculo {
    const marcaVehiculo = new MarcaVehiculo();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
