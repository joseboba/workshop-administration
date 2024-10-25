import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: './dist/fonts/Roboto-Regular.ttf',
    bold: './dist/fonts/Roboto-Medium.ttf',
    italics: './dist/fonts/Roboto-Italic.ttf',
    bolditalics: './dist/fonts/Roboto-MediumItalic.ttf',
    // normal: 'fonts/Roboto-Regular.ttf',
    // bold: 'fonts/Roboto-Medium.ttf',
    // italics: 'fonts/Roboto-Italic.ttf',
    // bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts);

  createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}
