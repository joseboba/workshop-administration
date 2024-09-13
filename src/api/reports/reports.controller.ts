import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('serviciosMasSolicitados')
  async getServiciosMasSolicitados(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getServiciosMasSolicitados();

    pdfDoc.info.Title = 'Servicios mas solicitados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Get('serviciosMenosSolicitados')
  async getServiciosMenosSolicitados(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getServiciosMenosSolicitados();

    pdfDoc.info.Title = 'Servicios menos solicitados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('repuestosMasCaros')
  async getRepuestosMasCaros(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getRepuestoMasCaros();

    pdfDoc.info.Title = 'Repuestos mas caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Get('repuestosMenosCaros')
  async getRepuestosMenosCaros(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getRepuestoMenosCaros();

    pdfDoc.info.Title = 'Repuestos menos caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('marcasMasAtendidas')
  async getMarcasMasAtendidas(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getMarcasMasAtendidas();

    pdfDoc.info.Title = 'Marcas mas atendidas';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('clientesMasRecurrentes')
  async getClientesMasRecurrentes(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getClientesMasRecurrentes();

    pdfDoc.info.Title = 'Clientes mas recurrentes';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
