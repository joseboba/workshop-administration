import { PartialType } from '@nestjs/swagger';
import { CreateMarcaProductoDto } from './create-marca_producto.dto';

export class UpdateMarcaProductoDto extends PartialType(CreateMarcaProductoDto) {
  mheCodigo: number;
}
