import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ServiciosMasMenosSolicitadosDto } from './filters/servicios-mas-menos-solicitados.dto';
import { RepuestosMasMenosCarosDto } from './filters/repuestos-mas-menos-caros.dto';
import { MarcasMasAtendidasDto } from './filters/marcas-mas-atendidas.dto';
import { ClientesMasRecurrentesDto } from './filters/clientes-mas-recurrentes.dto';

@Controller('reports')
@ApiTags('Reportes')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('serviciosMasSolicitados')
  async getServiciosMasSolicitados(
    @Query() filters: ServiciosMasMenosSolicitadosDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getServiciosMasSolicitados(
      filters.startDate,
      filters.endDate,
      filters.tipoServicio,
    );

    pdfDoc.info.Title = 'Servicios mas solicitados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Get('serviciosMenosSolicitados')
  async getServiciosMenosSolicitados(
    @Query() filters: ServiciosMasMenosSolicitadosDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getServiciosMenosSolicitados(
      filters.startDate,
      filters.endDate,
      filters.tipoServicio,
    );

    pdfDoc.info.Title = 'Servicios menos solicitados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('repuestosMasCaros')
  async getRepuestosMasCaros(
    @Query() filters: RepuestosMasMenosCarosDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getRepuestoMasCaros(filters);

    pdfDoc.info.Title = 'Repuestos mas caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Get('repuestosMenosCaros')
  async getRepuestosMenosCaros(
    @Query() filters: RepuestosMasMenosCarosDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getRepuestoMenosCaros(filters);

    pdfDoc.info.Title = 'Repuestos menos caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('marcasMasAtendidas')
  async getMarcasMasAtendidas(
    @Query() filters: MarcasMasAtendidasDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getMarcasMasAtendidas(filters);

    pdfDoc.info.Title = 'Marcas mas atendidas';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('clientesMasRecurrentes')
  async getClientesMasRecurrentes(
    @Query() filters: ClientesMasRecurrentesDto,
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getClientesMasRecurrentes(filters);

    pdfDoc.info.Title = 'Clientes mas recurrentes';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('mecanicosConMaServicios')
  async getMecanicosConMasServicios(@Res() response: Response) {
    const pdfDoc = await this.reportsService.getMecanicosConMasServicios();

    pdfDoc.info.Title = 'Mecanicos con más servicios';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('serviciosPrestadosMasCaros')
  async getServiciosPrestadosMasCaros(@Res() response: Response) {
    const pdfDoc =
      await this.reportsService.getServiciosPrestadosMasMenosCaros('DESC');

    pdfDoc.info.Title = 'Servicios prestados mas caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('serviciosPrestadosMenosCaros')
  async getServiciosPrestadosMenosCaros(@Res() response: Response) {
    const pdfDoc =
      await this.reportsService.getServiciosPrestadosMasMenosCaros('ASC');

    pdfDoc.info.Title = 'Servicios prestados menos caros';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('vehiculosMasNuevosReparados')
  async getVehiculosMasNuevosReparados(@Res() response: Response) {
    const pdfDoc =
      await this.reportsService.getVehiculosMasMenosNuevosReparados('DESC');

    pdfDoc.info.Title = 'Vehiculos mas nuevos reparados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('vehiculosMenosNuevosReparados')
  async getVehiculosMenosNuevosReparados(@Res() response: Response) {
    const pdfDoc =
      await this.reportsService.getVehiculosMasMenosNuevosReparados('ASC');

    pdfDoc.info.Title = 'Vehiculos mas antiguos reparados';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('diasConMasMenosCitas')
  async getDiasConMasMenosCitas(@Res() response: Response) {
    const pdfDoc = await this.reportsService.diasConMasMenosCitas();

    pdfDoc.info.Title = 'Dias con más y menos citas';
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
