import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicioModule } from './api';
import * as process from 'process';
import { entities, TypeOrmExceptionInterceptor } from './config';
import { ServicioModule } from './api/servicio/servicio.module';
import { ClienteModule } from './api/cliente/cliente.module';
import { MecanicoModule } from './api/mecanico/mecanico.module';
import { EspecialidadMecanicaModule } from './api/especialidad_mecanica/especialidad_mecanica.module';
import { TipoRepuestoModule } from './api/tipo_repuesto/tipo_repuesto.module';
import { ProveedorModule } from './api/proveedor/proveedor.module';
import { RepuestoModule } from './api/repuesto/repuesto.module';
import { TipoPagoModule } from './api/tipo_pago/tipo_pago.module';
import { NivelGravedadModule } from './api/nivel_gravedad/nivel_gravedad.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MarcaVehiculoModule } from './api/marca_vehiculo/marca_vehiculo.module';
import { TipoVehiculoModule } from './api/tipo_vehiculo/tipo_vehiculo.module';
import { MarcaHerramientaModule } from './api/marca_herramienta/marca_herramienta.module';
import { MarcaEquipoModule } from './api/marca_equipo/marca_equipo.module';
import { MarcaProductoModule } from './api/marca_producto/marca_producto.module';
import { TallerModule } from './api/taller/taller.module';
import { DiasNoDisponiblesModule } from './api/dias_no_disponibles/dias_no_disponibles.module';
import { VehiculoModule } from './api/vehiculo/vehiculo.module';
import { CitaModule } from './api/cita/cita.module';
import { HerramientaModule } from './api/herramienta/herramienta.module';
import { EquipoTallerModule } from './api/equipo_taller/equipo_taller.module';
import { ProductoModule } from './api/producto/producto.module';
import { CootizacionModule } from './api/cootizacion/cootizacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: entities,
    }),
    TipoServicioModule,
    ServicioModule,
    ClienteModule,
    MecanicoModule,
    EspecialidadMecanicaModule,
    TipoRepuestoModule,
    ProveedorModule,
    RepuestoModule,
    TipoPagoModule,
    NivelGravedadModule,
    MarcaVehiculoModule,
    TipoVehiculoModule,
    MarcaHerramientaModule,
    MarcaEquipoModule,
    MarcaProductoModule,
    TallerModule,
    DiasNoDisponiblesModule,
    VehiculoModule,
    CitaModule,
    HerramientaModule,
    EquipoTallerModule,
    ProductoModule,
    CootizacionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TypeOrmExceptionInterceptor,
    },
  ],
})
export class AppModule {}
