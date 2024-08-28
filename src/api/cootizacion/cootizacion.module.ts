import { Module } from '@nestjs/common';
import { CootizacionService } from './cootizacion.service';
import { CootizacionController } from './cootizacion.controller';

@Module({
  controllers: [CootizacionController],
  providers: [CootizacionService],
})
export class CootizacionModule {}
