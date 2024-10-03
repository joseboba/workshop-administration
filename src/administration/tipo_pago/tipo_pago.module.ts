import { Module } from '@nestjs/common';
import { TipoPagoService } from './tipo_pago.service';
import { TipoPagoController } from './tipo_pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPago } from './entities/tipo_pago.entity';

@Module({
  controllers: [TipoPagoController],
  providers: [TipoPagoService],
  imports: [TypeOrmModule.forFeature([TipoPago])],
  exports: [TipoPagoService],
})
export class TipoPagoModule {}
