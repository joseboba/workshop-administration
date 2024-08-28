import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { MarcaVehiculo } from '../../marca_vehiculo/entities/marca_vehiculo.entity';
import { TipoVehiculo } from '../../tipo_vehiculo/entities/tipo_vehiculo.entity';
import { Cita } from '../../cita/entities/cita.entity';

@Entity('taa_vehiculo')
export class Vehiculo {

  @ApiProperty()
  @PrimaryColumn({ name: 'veh_placa' })
  vehPlaca: string;
  @ApiProperty()
  @Column({ name: 'veh_numero_chasis' })
  vehNumeroChasis: string;
  @ApiProperty()
  @Column({ name: 'veh_modelo' })
  vheModelo: number;
  @ApiProperty()
  @Column({ name: 'veh_color' })
  vheColor: string;
  @ApiProperty()
  @Column({ name: 'veh_kilometraje' })
  vehKilometraje: number;
  @ApiProperty({ type: () => Cliente })
  @JoinColumn({ name: 'cli_codigo' })
  @ManyToOne(() => Cliente, (entity) => entity.vehiculos)
  cliente: Cliente;
  @ApiProperty({ type: () => MarcaVehiculo })
  @JoinColumn({ name: 'mve_codigo' })
  @ManyToOne(() => MarcaVehiculo, (entity) => entity.vehiculos)
  marcaVehiculo: MarcaVehiculo;
  @ApiProperty({ type: () => TipoVehiculo })
  @JoinColumn({ name: 'tve_codigo' })
  @ManyToOne(() => TipoVehiculo, (entity) => entity.vehiculos)
  tipoVehiculo: TipoVehiculo;
  @JoinColumn({ name: 'veh_placa' })
  @OneToMany(() => Cita, (entity) => entity.vehiculo)
  citas: Cita[];

  public static fromUpdateDto(
    updateDto: UpdateVehiculoDto,
  ): Vehiculo {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateVehiculoDto,
  ): Vehiculo {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Vehiculo {
    const vehiculo = new Vehiculo();
    Object.assign(vehiculo, source);
    return vehiculo;
  }
}
