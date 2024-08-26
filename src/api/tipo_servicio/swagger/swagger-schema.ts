import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { TipoServicio } from '../entities/tipo_servicio.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(TipoServicio) },
        },
      },
    },
  ],
};
