import { CreateTipoVehiculoDto, UpdateTipoVehiculoDto } from '../dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
