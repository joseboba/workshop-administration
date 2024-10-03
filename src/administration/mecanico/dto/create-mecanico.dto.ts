import { ApiProperty } from '@nestjs/swagger';

export class CreateMecanicoDto {
  @ApiProperty()
  mecDpi: string;
  @ApiProperty()
  mecNombres: string;
  @ApiProperty()
  mecApellidos: string;
  @ApiProperty()
  mecNit: string;
  @ApiProperty()
  mecTelefono: string;
  @ApiProperty()
  mecCorreo: string;
  @ApiProperty({
    example: '2024-08-27',
  })
  mecFechaNacimiento: Date;
  @ApiProperty()
  mecSalario: number;
  @ApiProperty({
    example: '2024-08-27',
  })
  mecFechaContratacion: Date;
  @ApiProperty()
  mecAniosExperiencia: number;
  @ApiProperty()
  emeCodigo: number;
}
