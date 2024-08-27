import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNivelGravedadDto, UpdateNivelGravedadDto } from '../dto';

@Entity('taa_nivel_gravedad')
export class NivelGravedad {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'ngr_codigo' })
  ngrCodigo: number;
  @ApiProperty()
  @Column({ name: 'ngr_nombre' })
  ngrNombre: string;
  @ApiProperty()
  @Column({ name: 'ngr_detalle' })
  ngrDetalle: string;
  @ApiProperty()
  @Column({ name: 'ngr_estado' })
  ngrEstado: boolean;

  public static fromUpdateDto(updateDto: UpdateNivelGravedadDto): NivelGravedad {
    const nivelGravedad = new NivelGravedad();
    Object.assign(nivelGravedad, updateDto);
    return nivelGravedad;
  }

  public static fromCreateDto(createDto: CreateNivelGravedadDto): NivelGravedad {
    const nivelGravedad = new NivelGravedad();
    Object.assign(nivelGravedad, createDto);
    return nivelGravedad;
  }
}
