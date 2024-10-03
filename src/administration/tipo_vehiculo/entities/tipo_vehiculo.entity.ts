import { CreateTipoVehiculoDto, UpdateTipoVehiculoDto } from '../dto';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';

@Entity('taa_tipo_vehiculo')
export class TipoVehiculo {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'tve_codigo' })
  tveCodigo: number;
  @ApiProperty()
  @Column({ name: 'tve_nombre' })
  tveNombre: string;
  @ApiProperty()
  @Column({ name: 'tve_descripcion' })
  tveDescripcion: string;
  @JoinColumn({ name: 'tve_codigo' })
  @OneToMany(() => Vehiculo, (entity) => entity.tipoVehiculo)
  vehiculos: Vehiculo[];

  public static fromUpdateDto(updateDto: UpdateTipoVehiculoDto): TipoVehiculo {
    const tipoVehiculo = new TipoVehiculo();
    Object.assign(tipoVehiculo, updateDto);
    return tipoVehiculo;
  }

  public static fromCreateDto(createDto: CreateTipoVehiculoDto): TipoVehiculo {
    const tipoVehiculo = new TipoVehiculo();
    Object.assign(tipoVehiculo, createDto);
    return tipoVehiculo;
  }
}
