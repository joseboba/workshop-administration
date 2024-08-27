import { TipoServicio } from '../api/tipo_servicio/entities/tipo_servicio.entity';
import { Servicio } from '../api/servicio/entities/servicio.entity';
import { Cliente } from '../api/cliente/entities/cliente.entity';
import { EspecialidadMecanica } from '../api/especialidad_mecanica/entities/especialidad_mecanica.entity';
import { Mecanico } from '../api/mecanico/entities/mecanico.entity';
import { TipoRepuesto } from '../api/tipo_repuesto/entities/tipo_repuesto.entity';
import { Proveedor } from '../api/proveedor/entities/proveedor.entity';
import { Repuesto } from '../api/repuesto/entities/repuesto.entity';
import { NivelGravedad } from '../api/nivel_gravedad/entities/nivel_gravedad.entity';
import { TipoPago } from '../api/tipo_pago/entities/tipo_pago.entity';

export const entities = [
  TipoServicio,
  Servicio,
  Cliente,
  EspecialidadMecanica,
  Mecanico,
  TipoRepuesto,
  Proveedor,
  Repuesto,
  NivelGravedad,
  TipoPago,
];
