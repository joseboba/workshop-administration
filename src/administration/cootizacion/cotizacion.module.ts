import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  controllers: [CotizacionController],
  providers: [CotizacionService],
  imports: [TypeOrmModule.forFeature([Cotizacion]), ClienteModule]
})
export class CotizacionModule {}
