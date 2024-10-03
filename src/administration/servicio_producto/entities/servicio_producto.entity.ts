import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateVehiculoDto } from '../../vehiculo/dto/update-vehiculo.dto';
import { CreateServicioProductoDto } from '../dto/create-servicio_producto.dto';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { Producto } from '../../producto/entities/producto.entity';
import { UpdateServicioProductoDto } from '../dto/update-servicio_producto.dto';

@Entity('taa_servicio_producto')
export class ServicioProducto {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'srp_codigo' })
  srpCodigo: number;
  @ApiProperty()
  @Column({ name: 'srp_cantidad' })
  srpCantidad: number;
  @ApiProperty()
  @Column({ name: 'srp_subtotal' })
  srpSubtotal: number
  @ApiProperty({ type: () => Servicio })
  @JoinColumn({ name: 'srv_codigo' })
  @ManyToOne(() => Servicio, (entity) => entity.servicioProductos)
  servicio: Servicio;
  @ApiProperty({ type: () => Producto })
  @JoinColumn({ name: 'pro_codigo' })
  @ManyToOne(() => Producto, (entity) => entity.servicioProductos)
  producto: Producto;

  public static fromUpdateDto(
    updateDto: UpdateServicioProductoDto,
  ): ServicioProducto {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateServicioProductoDto,
  ): ServicioProducto {
    return this.parseDto(createDto);
  }

  private static parseDto(source): ServicioProducto {
    const vehiculo = new ServicioProducto();
    Object.assign(vehiculo, source);
    return vehiculo;
  }

}
