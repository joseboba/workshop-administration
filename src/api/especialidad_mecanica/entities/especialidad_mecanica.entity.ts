import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEspecialidadMecanicaDto, UpdateEspecialidadMecanicaDto } from '../dto';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';

@Entity('taa_especialidad_mecanica')
export class EspecialidadMecanica {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'eme_codigo' })
  emeCodigo: number;
  @ApiProperty()
  @Column({ name: 'eme_nombre' })
  emeNombre: string;
  @ApiProperty()
  @Column({ name: 'eme_descripcion' })
  emeDescripcion: string;
  @OneToMany(() => Mecanico, (entity) => entity.especialidadMecanica)
  @JoinColumn({ name: 'eme_codigo' })
  mecanicos: Mecanico[];

  public static fromUpdateDto(updateDto: UpdateEspecialidadMecanicaDto): EspecialidadMecanica {
    const especialidadMecanica = new EspecialidadMecanica();
    Object.assign(especialidadMecanica, updateDto);
    return especialidadMecanica;
  }

  public static fromCreateDto(createDto: CreateEspecialidadMecanicaDto): EspecialidadMecanica {
    const especialidadMecanica = new EspecialidadMecanica();
    Object.assign(especialidadMecanica, createDto);
    return especialidadMecanica;
  }
}
