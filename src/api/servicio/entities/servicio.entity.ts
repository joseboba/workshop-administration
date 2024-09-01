import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TipoServicio } from '../../tipo_servicio/entities/tipo_servicio.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateServicioDto, UpdateServicioDto } from '../dto';
import { ServicioRepuesto } from '../../servicio_repuesto/entities/servicio_repuesto.entity';
import { ServicioProducto } from '../../servicio_producto/entities/servicio_producto.entity';

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
  @ApiProperty({ type: () => ServicioRepuesto, isArray: true })
  @JoinColumn({ name: 'srv_codigo' })
  @OneToMany(() => ServicioRepuesto, (entity) => entity.servicio)
  serviciosRepuesto: ServicioRepuesto[];
  @ApiProperty({ type: () => ServicioProducto, isArray: true })
  @JoinColumn({ name: 'srv_codigo' })
  @OneToMany(() => ServicioProducto, (entity) => entity.servicio)
  servicioProductos: ServicioProducto[];

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
