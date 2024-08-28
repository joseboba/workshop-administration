import { UpdateMarcaHerramientaDto } from '../dto/update-marca_herramienta.dto';
import { CreateMarcaHerramientaDto } from '../dto/create-marca_herramienta.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('taa_marca_herramienta')
export class MarcaHerramienta {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'mhe_codigo' })
  mheCodigo: number;
  @ApiProperty()
  @Column({ name: 'mhe_nombre' })
  mheNombre: string;
  public static fromUpdateDto(
    updateDto: UpdateMarcaHerramientaDto,
  ): MarcaHerramienta {
    return this.parseDto(updateDto);
  }

  public static fromCreateDto(
    createDto: CreateMarcaHerramientaDto,
  ): MarcaHerramienta {
    return this.parseDto(createDto);
  }

  private static parseDto(source): MarcaHerramienta {
    const marcaVehiculo = new MarcaHerramienta();
    Object.assign(marcaVehiculo, source);
    return marcaVehiculo;
  }
}
