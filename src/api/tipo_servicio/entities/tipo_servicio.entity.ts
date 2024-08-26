import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateTipoServicioDto } from '../dto';

@Entity('taa_tipo_servicio')
export class TipoServicio {

  @PrimaryGeneratedColumn({ type: 'int', name: 'tsr_codigo' })
  @ApiProperty()
  tsrCodigo: number;

  @Column({ name: 'tsr_nombre', type: 'varchar', length: 50, nullable: false })
  @ApiProperty()
  tsrNombre: string;

  @Column({
    name: 'tsr_descripcion',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  @ApiProperty()
  tsrDescripcion: string;

  @Column({
    name: 'tsr_estado',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  @ApiProperty()
  tsrEstado: boolean;

  public static fromUpdateDto(updateDto: UpdateTipoServicioDto): TipoServicio {
    const tipoServicio = new TipoServicio();
    Object.assign(tipoServicio, updateDto);
    return tipoServicio;
  }
}
