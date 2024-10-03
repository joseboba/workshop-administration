import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationFiltersDto } from '../../../commons';


export class UsuarioPaginationFiltersDto extends PartialType(PaginationFiltersDto) {

  @ApiProperty({
    required: false,
    type: String,
    description: 'Parametro de ordenamiento (cliente) cli.proiedad,(asc|desc) | (mecanico) mec.propiedad,(asc|desc)',
  })
  sort?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Busqueda por el nombre del cliente',
  })
  clienteNombre: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Busqueda por el nombre del mecanico',
  })
  mecanicoNombre: string;


  @ApiProperty({
    required: false,
    type: String,
    description: 'Busqueda por el dpi del cliente',
  })
  clienteDpi: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Busqueda por el dpi del mecanico',
  })
  mecanicoDpi: string;
}