import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoServicio } from '../../tipo_servicio/entities/tipo_servicio.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateServicioDto, UpdateServicioDto } from '../dto';

@Entity('taa_servicio')
export class Servicio {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'srv_codigo' })
  srvCodigo: number;
  @ApiProperty()
  @Column({
    name: 'srv_nombre',
  })
  srvNombre: string;
  @ApiProperty()
  @Column({
    name: 'srv_descripcion',
  })
  srvDescripcion: string;
  @ApiProperty()
  @Column({
    name: 'srv_costo',
  })
  srvCosto: number;
  @ApiProperty()
  @Column({
    name: 'srv_costo_repuestos',
  })
  srvCostoRepuestos: number;
  @ApiProperty()
  @Column({
    name: 'srv_costo_productos',
  })
  srvCostoProductos: number;
  @ApiProperty()
  @Column({
    name: 'srv_estado',
  })
  srvEstado: boolean;
  @ApiProperty({ type: () => TipoServicio })
  @ManyToOne(() => TipoServicio, (entity) => entity.servicios)
  @JoinColumn({ name: 'tsr_codigo' })
  tipoServicio: TipoServicio;

  public static fromUpdateDto(updateDto: UpdateServicioDto): Servicio {
    const servicio = new Servicio();
    Object.assign(servicio, updateDto);
    return servicio;
  }

  public static fromCreateDto(createDto: CreateServicioDto): Servicio {
    const servicio = new Servicio();
    Object.assign(servicio, createDto);
    return servicio;
  }
}
