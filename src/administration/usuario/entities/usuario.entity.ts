import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Mecanico } from '../../mecanico/entities/mecanico.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';

@Entity('taa_usuario')
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'usr_codigo' })
  usrCodigo: number;
  @ApiProperty()
  @Column({ name: 'usr_contrasenia' })
  usrContrasenia: string;
  @ApiProperty()
  @Column({ name: 'usr_estado' })
  usrEstado: boolean;
  @ApiProperty()
  @Column({ name: 'usr_administrador' })
  usrAdministrador: boolean;
  @ApiProperty({ type: () => Mecanico })
  @JoinColumn({ name: 'mec_codigo' })
  @OneToOne(() => Mecanico, (entity) => entity.usuario)
  mecanico: Mecanico;
  @ApiProperty({ type: () => Cliente })
  @JoinColumn({ name: 'cli_codigo' })
  @OneToOne(() => Cliente, (entity) => entity.usuario)
  cliente: Cliente;

  public static fromUpdateDto(updateDto: UpdateUsuarioDto): Usuario {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(createDto: CreateUsuarioDto): Usuario {
    return this.parseDto(createDto);
  }

  private static parseDto(source): Usuario {
    const usuario = new Usuario();
    Object.assign(usuario, source);
    return usuario;
  }
}
