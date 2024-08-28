import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { Repuesto } from '../../repuesto/entities/repuesto.entity';
import { UpdateServicioRepuestoDto } from '../dto/update-servicio_repuesto.dto';
import { CreateServicioRepuestoDto } from '../dto/create-servicio_repuesto.dto';

@Entity('taa_servicio_repuesto')
export class ServicioRepuesto {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'srr_codigo' })
  srrCodigo: number;
  @ApiProperty()
  @Column({ name: 'srr_cantidad' })
  srrCantidad: number;
  @ApiProperty()
  @Column({ name: 'srr_subtotal' })
  srrSubtotal: number;
  @ApiProperty({ type: () => Servicio })
  @JoinColumn({ name: 'srv_codigo' })
  @ManyToOne(() => Servicio, (entity) => entity.serviciosRepuesto)
  servicio: Servicio;
  @ApiProperty({ type: () => Repuesto })
  @JoinColumn({ name: 'rep_codigo' })
  @ManyToOne(() => Repuesto, (entity) => entity.serviciosRepuesto)
  repuesto: Repuesto;

  public static fromUpdateDto(
    updateDto: UpdateServicioRepuestoDto,
  ): ServicioRepuesto {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateServicioRepuestoDto,
  ): ServicioRepuesto {
    return this.parseDto(createDto);
  }

  private static parseDto(source): ServicioRepuesto {
    const servicioRepuesto = new ServicioRepuesto();
    Object.assign(servicioRepuesto, source);
    return servicioRepuesto;
  }
}