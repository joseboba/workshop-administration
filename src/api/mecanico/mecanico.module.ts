import { Module } from '@nestjs/common';
import { MecanicoService } from './mecanico.service';
import { MecanicoController } from './mecanico.controller';

@Module({
  controllers: [MecanicoController],
  providers: [MecanicoService],
})
export class MecanicoModule {}
