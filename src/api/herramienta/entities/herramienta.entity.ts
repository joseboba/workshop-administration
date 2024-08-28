import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';
import { MarcaHerramienta } from '../../marca_herramienta/entities/marca_herramienta.entity';
import { UpdateHerramientaDto } from '../dto/update-herramienta.dto';
import { CreateHerramientaDto } from '../dto/create-herramienta.dto';

@Entity('taa_herramienta')
export class Herramienta {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'her_codigo' })
  herCodigo: number;
  @ApiProperty()
  @Column({ name: 'her_nombre' })
  herNombre: string;
  @ApiProperty()
  @Column({ name: 'her_descripcion' })
  herDescripcion: string;
  @ApiProperty()
  @Column({ name: 'her_condicion' })
  herCondicion: number;
  @ApiProperty()
  @JoinColumn({ name: 'mec_codigo' })
  @ManyToOne(() => Mecanico, (entity) => entity.herramientas)
  mecanico: Mecanico;
  @ApiProperty()
  @JoinColumn({ name: 'mhe_codigo' })
  @ManyToOne(() => MarcaHerramienta, (entity) => entity.herramientas)
  marcaHerramienta: MarcaHerramienta;

  public static fromUpdateDto(updateDto: UpdateHerramientaDto): Herramienta {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(createDto: CreateHerramientaDto): Herramienta {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Herramienta {
    const herramienta = new Herramienta();
    Object.assign(herramienta, source);
    return herramienta;
  }
}
