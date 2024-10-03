import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from '../../administration/printer/printer.module';
import { ServicioModule } from '../../administration/servicio/servicio.module';
import { RepuestoModule } from '../../administration/repuesto/repuesto.module';
import { CitaModule } from '../../administration/cita/cita.module';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [PrinterModule, ServicioModule, CitaModule, RepuestoModule],
})
export class ReportsModule {}
