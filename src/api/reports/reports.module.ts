import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from '../printer/printer.module';
import { ServicioModule } from '../servicio/servicio.module';
import { RepuestoModule } from '../repuesto/repuesto.module';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [PrinterModule, ServicioModule, RepuestoModule],
})
export class ReportsModule {}
