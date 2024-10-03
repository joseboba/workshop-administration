import { Injectable } from '@nestjs/common';
import { GeneralReport, generalReport } from './documents/general_report';
import { PrinterService } from '../../administration/printer/printer.service';
import { ServicioService } from '../../administration/servicio/servicio.service';
import { RepuestoService } from '../../administration/repuesto/repuesto.service';
import { CitaService } from '../../administration/cita/cita.service';
import { citaReport, GeneralReportCitas } from './documents/cita_report';

@Injectable()
export class ReportsService {
  constructor(
    private readonly printer: PrinterService,
    private readonly servicio: ServicioService,
    private readonly cita: CitaService,
    private readonly repuesto: RepuestoService,
  ) {}

  private getServiciosMasMenosSolicitadosContent(
    result: {
      codigo: number;
      nombre: string;
      costo: string;
      solicitudes: string;
    }[],
    title: 'MÁS' | 'MENOS',
  ): GeneralReport {
    return {
      title: `LOS 10 SERVICIOS ${title} SOLICITADOS`,
      table: {
        header: {
          headers: ['CODIGO', 'NOMBRE', 'PRECIO', 'CANTIDAD DE SOLICITUDES'],
          widths: [50, '*', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.codigo, alignment: 'center' },
          { text: item.nombre, alignment: 'left' },
          { text: item.costo, alignment: 'right' },
          { text: item.solicitudes, alignment: 'right' },
        ]),
      },
    };
  }

  private getRepuestoMasMenosCaros(
    result: {
      codigo: number;
      nombreProveedor: string;
      precio: string;
      cantidad: string;
      nombre: string;
    }[],
    title: 'MÁS' | 'MENOS',
  ): GeneralReport {
    return {
      title: `LOS 10 REPUESTOS ${title} CAROS`,
      table: {
        header: {
          headers: ['CODIGO', 'NOMBRE', 'INVENTARIO', 'PRECIO', 'PROVEEDOR'],
          widths: ['auto', '*', 'auto', 'auto', '*'],
        },
        content: result.map((item) => [
          { text: item.codigo, alignment: 'center' },
          { text: item.nombre, alignment: 'left' },
          { text: item.cantidad, alignment: 'right' },
          { text: item.precio, alignment: 'right' },
          { text: item.nombreProveedor, alignment: 'left' },
        ]),
      },
    };
  }

  async getServiciosMasSolicitados(): Promise<PDFKit.PDFDocument> {
    const result = await this.servicio.serviciosMasMenosSolicitados('DESC');
    const content = this.getServiciosMasMenosSolicitadosContent(result, 'MÁS');
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getServiciosMenosSolicitados(): Promise<PDFKit.PDFDocument> {
    const result = await this.servicio.serviciosMasMenosSolicitados('ASC');
    const content = this.getServiciosMasMenosSolicitadosContent(
      result,
      'MENOS',
    );
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getRepuestoMasCaros(): Promise<PDFKit.PDFDocument> {
    const result = await this.repuesto.repuestosMasMenosCaros('DESC');
    const content = this.getRepuestoMasMenosCaros(result, 'MÁS');
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getRepuestoMenosCaros(): Promise<PDFKit.PDFDocument> {
    const result = await this.repuesto.repuestosMasMenosCaros('ASC');
    const content = this.getRepuestoMasMenosCaros(result, 'MENOS');
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getMarcasMasAtendidas(): Promise<PDFKit.PDFDocument> {
    const result = await this.servicio.marcasDeCarrosMasAtendidas();
    const content: GeneralReport = {
      title: `LAS 10 MARCAS DE CARRO MÁS ATENDIDAS`,
      table: {
        header: {
          headers: ['MARCA', 'CANTIDAD', '% DEL TOTAL'],
          widths: ['*', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.nombre, alignment: 'left' },
          { text: item.cantidad, alignment: 'right' },
          { text: item.porcentaje, alignment: 'right' },
        ]),
      },
    };

    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getClientesMasRecurrentes(): Promise<PDFKit.PDFDocument> {
    const result = await this.servicio.getClientesMasRecurrentes();
    const content: GeneralReport = {
      title: `LAS 10 CLIENTES MÁS RECURRENTES`,
      table: {
        header: {
          headers: ['CLIENTE', 'VEHICULO', 'MODELO', 'NO. VISITAS'],
          widths: ['*', 'auto', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.cliente, alignment: 'left' },
          { text: item.vehiculo, alignment: 'left' },
          { text: item.modelo, alignment: 'left' },
          { text: item.visitas, alignment: 'right' },
        ]),
      },
    };

    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getMecanicosConMasServicios(): Promise<PDFKit.PDFDocument> {
    const result = await this.servicio.getMecanicosConMasServicios();
    const content: GeneralReport = {
      title: 'LOS 10 MECÁNICOS CON MÁS SERVICIOS',
      table: {
        header: {
          headers: [
            'NOMBRES',
            'APELLIDOS',
            'NO. SERVICIOS',
            'CODIGO EMPLEADO',
            'ESPECIALIDAD',
          ],
          widths: ['*', '*', 'auto', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.nombres, alignment: 'left' },
          { text: item.apellidos, alignment: 'left' },
          { text: item.servicios, alignment: 'right' },
          { text: item.codigoEmpleado, alignment: 'right' },
          { text: item.especialidadMecanica, alignment: 'left' },
        ]),
      },
    };
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getServiciosPrestadosMasMenosCaros(
    order: 'ASC' | 'DESC',
  ): Promise<PDFKit.PDFDocument> {
    const result =
      await this.servicio.getServiciosPrestadosMasMenosCaros(order);
    const content: GeneralReport = {
      title: `LOS 5 SERVICIOS PRESTADOS MÁS ${order === 'DESC' ? 'CAROS' : 'BARATOS'}`,
      table: {
        header: {
          headers: [
            'CODIGO',
            'NOMBRE',
            'DESCRIPCIÓN',
            'PRECIO',
            'CANTIDAD DE SOLICITUDES',
          ],
          widths: ['auto', 'auto', '*', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.codigo, alignment: 'right' },
          { text: item.nombre, alignment: 'left' },
          { text: item.descripcion, alignment: 'left' },
          { text: item.costo, alignment: 'left' },
          { text: item.cantidadSolicitudes, alignment: 'right' },
        ]),
      },
    };
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async getVehiculosMasMenosNuevosReparados(
    order: 'ASC' | 'DESC',
  ): Promise<PDFKit.PDFDocument> {
    const result =
      await this.servicio.getVehiculosMasMenosNuevosReparados(order);
    const content: GeneralReport = {
      title: `LOS 5 VEHÍCULOS MÁS ${order === 'DESC' ? 'NUEVOS' : 'ANTIGUOS'}`,
      table: {
        header: {
          headers: ['PLACA', 'MARCA', 'MODELO', 'CANTIDAD DE VISITAS'],
          widths: ['auto', '*', 'auto', 'auto'],
        },
        content: result.map((item) => [
          { text: item.placa, alignment: 'left' },
          { text: item.marca, alignment: 'left' },
          { text: item.modelo, alignment: 'left' },
          { text: item.vistas, alignment: 'right' },
        ]),
      },
    };
    const docDefinition = generalReport(content);
    return this.printer.createPdf(docDefinition);
  }

  async diasConMasMenosCitas(): Promise<PDFKit.PDFDocument> {
    const result = await this.cita.getDiaDeLaSemanaConMasMenosCitas();
    const content: GeneralReportCitas = {
      title: `DÍAS DE LA SEMANA CON MÁS Y MENOS CITAS`,
      table: {
        header: {
          headers: ['DIA DE LA SEMANA', 'NÚMERO DE CITAS'],
          widths: ['auto', 'auto'],
        },
        content: result.allDays.map((item) => [
          { text: item.dia, alignment: 'left' },
          { text: item.numeroCitas, alignment: 'left' },
        ]),
      },
      diaMenosCitas: result.diaMenosCitas.dia,
      numeroMenosCitas: result.diaMenosCitas.numeroCitas,
      diasMasCitas: result.diaMasCitas.dia,
      numeroMasCitas: result.diaMasCitas.numeroCitas,
    };
    const docDefinition = citaReport(content);
    return this.printer.createPdf(docDefinition);
  }
}
