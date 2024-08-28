import { UpdateTallerDto } from '../dto/update-taller.dto';
import { CreateTallerDto } from '../dto/create-taller.dto';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DiasNoDisponible } from '../../dias_no_disponibles/entities/dias_no_disponible.entity';

@Entity('taa_taller')
export class Taller {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'tll_codigo' })
  tllCodigo: number;
  @ApiProperty()
  @Column({ name: 'tll_nombre' })
  tllNombre: string;
  @ApiProperty()
  @Column({ name: 'tll_telefono' })
  tllTelefono: string;
  @ApiProperty()
  @Column({ name: 'tll_direccion' })
  tllDireccion: string;
  @ApiProperty()
  @Column({ name: 'tll_correo' })
  tllCorreo: string;
  @OneToMany(() => DiasNoDisponible, (entity) => entity.taller)
  @JoinColumn({ name: 'tll_codigo' })
  diasNoDisponibles: DiasNoDisponible[];

  public static fromUpdateDto(
    updateDto: UpdateTallerDto,
  ): Taller {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateTallerDto,
  ): Taller {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Taller {
    const marcaVehiculo = new Taller();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
