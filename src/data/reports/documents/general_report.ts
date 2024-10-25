import {
  Size,
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { BadRequestException } from '@nestjs/common';

const styles: StyleDictionary = {
  h1: {
    fontSize: 20,
    bold: true,
    margin: [0, 5],
  },
  h2: {
    fontSize: 16,
    bold: true,
  },
  h3: {
    fontSize: 14,
    bold: true,
  },
  h4: {
    fontSize: 12,
  },
  h4Bold: {
    fontSize: 12,
    bold: true,
  },
};

interface TableHeaders {
  widths: '*' | 'auto' | Size[] | undefined;
  headers: string[];
}

interface Table {
  header: TableHeaders;
  content: TableCell[][];
}

export interface GeneralReport {
  title: string;
  table: Table;
}

export const generalReport = ({
  title,
  table,
}: GeneralReport): TDocumentDefinitions => {
  if (table.header.headers.length !== table.header.widths.length) {
    throw new BadRequestException('Invalid Headers');
  }

  return {
    pageSize: 'A4',
    content: [
      {
        text: title,
        alignment: 'center',
        style: 'h1',
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 1,
          },
        ],
      },
      {
        margin: [0, 25, 0, 0],
        columns: [
          {
            text: '',
          },
          {
            text: 'Fecha y hora de creación: '.toLocaleUpperCase(),
            style: 'h4',
            alignment: 'right',
          },
          {
            text: Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              hour12: false,
              minute: 'numeric',
              second: 'numeric',
            })
              .format(new Date())
              .replace(',', ''),
            style: 'h4',
            alignment: 'right',
          },
        ],
      },
      {
        margin: [0, 60, 0, 0],
        layout: 'lightHorizontalLines',
        table: {
          widths: table.header.widths,
          headerRows: 1,
          body: [
            [
              ...table.header.headers.map(
                (header): TableCell => ({
                  text: header,
                  alignment: 'center',
                }),
              ),
            ],
            ...table.content,
          ],
        },
      },
    ],
    styles,
  };
};
