import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoServicioModule } from './api';
import * as process from 'process';
import { entities } from './config';
import { ServicioModule } from './api/servicio/servicio.module';
import { ClienteModule } from './api/cliente/cliente.module';
import { MecanicoModule } from './api/mecanico/mecanico.module';
import { TaaEspecialidadMecanicaModule } from './api/taa_especialidad_mecanica/taa_especialidad_mecanica.module';
import { EspecialidadMecanicaModule } from './api/especialidad_mecanica/especialidad_mecanica.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
