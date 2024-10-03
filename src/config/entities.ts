import { TipoServicio } from '../administration/tipo_servicio/entities/tipo_servicio.entity';
import { Servicio } from '../administration/servicio/entities/servicio.entity';
import { Cliente } from '../administration/cliente/entities/cliente.entity';
import { EspecialidadMecanica } from '../administration/especialidad_mecanica/entities/especialidad_mecanica.entity';
import { Mecanico } from '../administration/mecanico/entities/mecanico.entity';
import { TipoRepuesto } from '../administration/tipo_repuesto/entities/tipo_repuesto.entity';
import { Proveedor } from '../administration/proveedor/entities/proveedor.entity';
import { Repuesto } from '../administration/repuesto/entities/repuesto.entity';
import { NivelGravedad } from '../administration/nivel_gravedad/entities/nivel_gravedad.entity';
import { TipoPago } from '../administration/tipo_pago/entities/tipo_pago.entity';
import { TipoVehiculo } from '../administration/tipo_vehiculo/entities/tipo_vehiculo.entity';
import { MarcaVehiculo } from '../administration/marca_vehiculo/entities/marca_vehiculo.entity';
import { MarcaEquipo } from '../administration/marca_equipo/entities/marca_equipo.entity';
import { MarcaHerramienta } from '../administration/marca_herramienta/entities/marca_herramienta.entity';
import { MarcaProducto } from '../administration/marca_producto/entities/marca_producto.entity';
import { Taller } from '../administration/taller/entities/taller.entity';
import { DiasNoDisponible } from '../administration/dias_no_disponibles/entities/dias_no_disponible.entity';
import { Vehiculo } from '../administration/vehiculo/entities/vehiculo.entity';
import { Cita } from '../administration/cita/entities/cita.entity';
import { Herramienta } from '../administration/herramienta/entities/herramienta.entity';
import { EquipoTaller } from '../administration/equipo_taller/entities/equipo_taller.entity';
import { Producto } from '../administration/producto/entities/producto.entity';
import { Cotizacion } from '../administration/cootizacion/entities/cotizacion.entity';
import { ServicioRepuesto } from '../administration/servicio_repuesto/entities/servicio_repuesto.entity';
import { ServicioProducto } from '../administration/servicio_producto/entities/servicio_producto.entity';
import { Usuario } from '../administration/usuario/entities/usuario.entity';
import { OrdenTrabajo } from '../administration/orden_trabajo/entities/orden_trabajo.entity';
import { ServicioOrdenTrabajo } from '../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';
import { DesperfectoOrdenTrabajo } from '../administration/desperfecto_orden_trabajo/desperfecto_orden_trabajo.entity';
import { ProductoServicioOrdenTrabajo } from '../administration/producto_servicio_orden_trabajo/producto_servicio_orden_trabajo.entity';
import {
  RepuestoServicioOrdenTrabajo
} from '../administration/repuesto_servicio_orden_trabajo/repuesto_servicio_orden_trabajo.entity';
import { Pago } from '../operation/payment/entities/pago.entity';

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
  DiasNoDisponible,
  Vehiculo,
  Cita,
  Herramienta,
  EquipoTaller,
  Producto,
  Cotizacion,
  ServicioRepuesto,
  ServicioProducto,
  Usuario,
  OrdenTrabajo,
  ServicioOrdenTrabajo,
  DesperfectoOrdenTrabajo,
  ProductoServicioOrdenTrabajo,
  RepuestoServicioOrdenTrabajo,
  Pago,
];
