import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { Cita } from '../entities/cita.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(Cita) },
        },
      },
    },
  ],
};
