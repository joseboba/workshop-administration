import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { ClienteModule } from '../cliente/cliente.module';
import { MecanicoModule } from '../mecanico/mecanico.module';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ClienteModule,
    MecanicoModule,
  ],
})
export class UsuarioModule {
}
