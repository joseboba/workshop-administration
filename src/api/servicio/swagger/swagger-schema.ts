import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { Servicio } from '../entities/servicio.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(Servicio) },
        },
      },
    },
  ],
};
