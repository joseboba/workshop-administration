import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { Herramienta } from '../entities/herramienta.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(Herramienta) },
        },
      },
    },
  ],
};
