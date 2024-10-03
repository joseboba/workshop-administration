import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProveedorDto, UpdateProveedorDto } from '../dto';
import { Repuesto } from '../../repuesto/entities/repuesto.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('taa_proveedor')
export class Proveedor {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'prv_codigo' })
  prvCodigo: number;
  @ApiProperty()
  @Column({ name: 'prv_nombre' })
  prvNombre: string;
  @ApiProperty()
  @Column({ name: 'prv_nombre_contacto' })
  prvNombreContacto: string;
  @ApiProperty()
  @Column({ name: 'prv_telefono' })
  prvTelefono: string;
  @ApiProperty()
  @Column({ name: 'prv_correo' })
  prvCorreo: string;
  @ApiProperty()
  @Column({ name: 'prv_estado' })
  prvEstado: boolean;
  @OneToMany(() => Repuesto, (entity) => entity.proveedor)
  @JoinColumn({ name: 'prv_codigo' })
  repuestos: Repuesto[];
  @JoinColumn({ name: 'prv_codigo' })
  productos: Producto[];

  public static fromUpdateDto(updateDto: UpdateProveedorDto): Proveedor {
    const proveedor = new Proveedor();
    Object.assign(proveedor, updateDto);
    return proveedor;
  }

  public static fromCreateDto(createDto: CreateProveedorDto): Proveedor {
    const proveedor = new Proveedor();
    Object.assign(proveedor, createDto);
    return proveedor;
  }
}
