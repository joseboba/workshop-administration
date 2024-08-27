import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EspecialidadMecanica } from '../../especialidad_mecanica/entities/especialidad_mecanica.entity';
import { CreateEspecialidadMecanicaDto, UpdateEspecialidadMecanicaDto } from '../../especialidad_mecanica/dto';
import { CreateMecanicoDto, UpdateMecanicoDto } from '../dto';

@Entity('taa_mecanico')
export class Mecanico {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'mec_codigo' })
  mecCodigo: number;
  @ApiProperty()
  @Column({ name: 'mec_dpi' })
  mecDpi: string;
  @ApiProperty()
  @Column({ name: 'mec_nombres' })
  mecNombres: string;
  @ApiProperty()
  @Column({ name: 'mec_apellidos' })
  mecApellidos: string;
  @ApiProperty()
  @Column({ name: 'mec_nit' })
  mecNit: string;
  @ApiProperty()
  @Column({ name: 'mec_telefono' })
  mecTelefono: string;
  @ApiProperty()
  @Column({ name: 'mec_correo' })
  mecCorreo: string;
  @ApiProperty()
  @Column({ name: 'mec_fecha_nacimiento' })
  mecFechaNacimiento: Date;
  @ApiProperty()
  @Column({ name: 'mec_salario' })
  mecSalario: number;
  @ApiProperty()
  @Column({ name: 'mec_fecha_contratacion' })
  mecFechaContratacion: Date;
  @ApiProperty()
  @Column({ name: 'mec_anios_experiencia' })
  mecAniosExperiencia: number;
  @ApiProperty({ type: () => EspecialidadMecanica })
  @ManyToOne(() => EspecialidadMecanica, (entity) => entity.mecanicos)
  @JoinColumn({ name: 'eme_codigo' })
  especialidadMecanica: EspecialidadMecanica;

  public static fromUpdateDto(updateDto: UpdateMecanicoDto): Mecanico {
    const mecanico = new Mecanico();
    Object.assign(mecanico, updateDto);
    return mecanico;
  }

  public static fromCreateDto(createDto: CreateMecanicoDto): Mecanico {
    const mecanico = new Mecanico();
    Object.assign(mecanico, createDto);
    return mecanico;
  }

}