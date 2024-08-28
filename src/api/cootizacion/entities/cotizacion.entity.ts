import { UpdateVehiculoDto } from '../../vehiculo/dto/update-vehiculo.dto';
import { CreateCotizacionDto } from '../dto/create-cotizacion.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { UpdateCotizacionDto } from '../dto/update-cotizacion.dto';

@Entity('taa_cotizacion')
export class Cotizacion {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'cot_codigo' })
  cotCodigo: number;
  @ApiProperty()
  @Column({ name: 'cot_fecha_creacion' })
  cotFechaCreacion: Date;
  @ApiProperty()
  @Column({ name: 'cot_fecha_vencimiento' })
  cotFechaVencimiento: Date;
  @ApiProperty()
  @Column({ name: 'cot_vigente' })
  cotVigente: boolean;
  @ApiProperty()
  @Column({ name: 'cot_subtotal' })
  cotSubtotal: number;
  @ApiProperty()
  @Column({ name: 'cot_descuento' })
  cotDescuento: number;
  @ApiProperty()
  @Column({ name: 'cot_total' })
  cotTotal: number;
  @ApiProperty({ type: () => Cliente })
  @JoinColumn({ name: 'cli_codigo' })
  @ManyToOne(() => Cliente, (entity) => entity.cootizaciones)
  cliente: Cliente;

  public static fromUpdateDto(updateDto: UpdateCotizacionDto): Cotizacion {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(createDto: CreateCotizacionDto): Cotizacion {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Cotizacion {
    const cootizacion = new Cotizacion();
    Object.assign(cootizacion, source);
    return cootizacion;
  }
}
