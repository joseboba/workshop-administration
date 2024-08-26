import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoServicio } from '../../tipo_servicio/entities/tipo_servicio.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateServicioDto, UpdateServicioDto } from '../dto';

@Entity('taa_servicio')
export class Servicio {

  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'srv_codigo' })
  srvCodigo: number;
  @ApiProperty()
  @Column({
    name: 'srv_nombre',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  srvNombre: string;
  @ApiProperty()
  @Column({
    name: 'srv_descripcion',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  srvDescripcion: string;
  @ApiProperty()
  @Column({
    name: 'srv_costo',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  srvCosto: number;
  @ApiProperty()
  @Column({
    name: 'srv_costo_repuestos',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  srvCostoRepuestos: number;
  @ApiProperty()
  @Column({
    name: 'srv_costo_productos',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  srvCostoProductos: number;
  @ApiProperty()
  @Column({
    name: 'srv_estado',
    type: 'boolean',
    nullable: false,
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
