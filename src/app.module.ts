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
