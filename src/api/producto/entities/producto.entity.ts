import { UpdateProductoDto } from '../dto/update-producto.dto';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { MarcaProducto } from '../../marca_producto/entities/marca_producto.entity';

@Entity('taa_producto')
export class Producto {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'pro_codigo' })
  proCodigo: number;
  @ApiProperty()
  @Column({ name: 'pro_nombre' })
  proNombre: string;
  @ApiProperty()
  @Column({ name: 'pro_descripcion' })
  proDescripcion: string;
  @ApiProperty()
  @Column({ name: 'pro_precio_compra' })
  proPrecioCompra: number;
  @ApiProperty()
  @Column({ name: 'pro_cantidad_disponible' })
  proCantidadDisponible: number;
  @ApiProperty()
  @Column({ name: 'pro_fecha_ingreso' })
  proFechaInrgeso: Date;
  @ApiProperty({ type: () => Proveedor })
  @JoinColumn({ name: 'prv_codigo' })
  @ManyToOne(() => Proveedor, (entity) => entity.productos)
  proveedor: Proveedor;
  @ApiProperty({ type: () => MarcaProducto })
  @JoinColumn({ name: 'map_codigo' })
  @ManyToOne(() => MarcaProducto, (entity) => entity.productos)
  marcaProducto: MarcaProducto;

  public static fromUpdateDto(updateDto: UpdateProductoDto): Producto {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(createDto: CreateProductoDto): Producto {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Producto {
    const producto = new Producto();
    Object.assign(producto, source);
    return producto;
  }
}
