import { UpdateMarcaProductoDto } from '../dto/update-marca_producto.dto';
import { CreateMarcaProductoDto } from '../dto/create-marca_producto.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('taa_marca_producto')
export class MarcaProducto {

  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'map_codigo' })
  mapCodigo: number;
  @ApiProperty()
  @Column({ name: 'map_nombre' })
  mapNombre: string;

  public static fromUpdateDto(
    updateDto: UpdateMarcaProductoDto,
  ): MarcaProducto {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateMarcaProductoDto,
  ): MarcaProducto {
    return this.parseDto(createDto);
  }

  private static parseDto(source): MarcaProducto {
    const marcaVehiculo = new MarcaProducto();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
