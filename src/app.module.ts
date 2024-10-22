import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { entities, TypeOrmExceptionInterceptor } from './config';

import { ReportsModule } from './data';

import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  CitaModule,
  ClienteModule,
  CotizacionModule,
  DiasNoDisponiblesModule,
  EquipoTallerModule,
  EspecialidadMecanicaModule,
  HerramientaModule,
  MarcaEquipoModule,
  MarcaHerramientaModule,
  MarcaProductoModule,
  MarcaVehiculoModule,
  MecanicoModule,
  NivelGravedadModule,
  PrinterModule,
  ProductoModule,
  ProveedorModule,
  RepuestoModule,
  ServicioModule,
  ServicioProductoModule,
  ServicioRepuestoModule,
  TallerModule,
  TipoPagoModule,
  TipoRepuestoModule,
  TipoServicioModule,
  TipoVehiculoModule,
  UsuarioModule,
  VehiculoModule,
} from './administration';
import { OrdenTrabajoModule } from './operation/orden_trabajo/orden_trabajo.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServicioOrdenTrabajoModule } from './operation/servicio_orden_trabajo/servicio_orden_trabajo.module';
import { PaymentModule } from './operation/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'jsalazarb4@miumg.edu.gt',
          pass: 'fyqtzzwvvhbimnfz',
        },
      },
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
    CotizacionModule,
    ServicioProductoModule,
    ServicioRepuestoModule,
    UsuarioModule,
    PrinterModule,
    ReportsModule,
    OrdenTrabajoModule,
    ServicioOrdenTrabajoModule,
    PaymentModule,
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
