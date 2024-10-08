import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClienteDto, UpdateClienteDto } from '../dto';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Cotizacion } from '../../cootizacion/entities/cotizacion.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('taa_cliente')
export class Cliente {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'cli_codigo' })
  cliCodigo: number;
  @ApiProperty()
  @Column({ name: 'cli_dpi' })
  cliDpi: string;
  @ApiProperty()
  @Column({ name: 'cli_nombres' })
  cliNombres: string;
  @ApiProperty()
  @Column({ name: 'cli_apellidos' })
  cliApellidos: string;
  @ApiProperty()
  @Column({ name: 'cli_nit' })
  cliNit: string;
  @ApiProperty()
  @Column({ name: 'cli_telefono' })
  cliTelefono: string;
  @ApiProperty()
  @Column({ name: 'cli_correo' })
  cliCorreo: string;
  @JoinColumn({ name: 'cli_codigo' })
  @OneToMany(() => Vehiculo, (entity) => entity.cliente)
  vehiculos: Vehiculo[];
  @JoinColumn({ name: 'cli_codigo' })
  cootizaciones: Cotizacion[];
  @JoinColumn({ name: 'cli_codigo' })
  @OneToOne(() => Usuario, (entity) => entity.cliente)
  usuario: Usuario;

  public static fromUpdateDto(updateDto: UpdateClienteDto): Cliente {
    const cliente = new Cliente();
    Object.assign(cliente, updateDto);
    return cliente;
  }

  public static fromCreateDto(createDto: CreateClienteDto): Cliente {
    const cliente = new Cliente();
    Object.assign(cliente, createDto);
    return cliente;
  }
}
