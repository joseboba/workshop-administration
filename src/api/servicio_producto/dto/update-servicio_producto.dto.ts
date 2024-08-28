import { PartialType } from '@nestjs/swagger';
import { CreateServicioProductoDto } from './create-servicio_producto.dto';

export class UpdateServicioProductoDto extends PartialType(CreateServicioProductoDto) {}
