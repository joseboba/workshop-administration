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
import { TipoVehiculo } from '../api/tipo_vehiculo/entities/tipo_vehiculo.entity';
import { MarcaVehiculo } from '../api/marca_vehiculo/entities/marca_vehiculo.entity';
import { MarcaEquipo } from '../api/marca_equipo/entities/marca_equipo.entity';
import { MarcaHerramienta } from '../api/marca_herramienta/entities/marca_herramienta.entity';
import { MarcaProducto } from '../api/marca_producto/entities/marca_producto.entity';
import { Taller } from '../api/taller/entities/taller.entity';
import { DiasNoDisponible } from '../api/dias_no_disponibles/entities/dias_no_disponible.entity';

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
  TipoVehiculo,
  MarcaVehiculo,
  MarcaEquipo,
  MarcaHerramienta,
  MarcaProducto,
  Taller,
  DiasNoDisponible
];
