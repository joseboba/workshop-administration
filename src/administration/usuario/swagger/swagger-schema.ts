import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(PaginationResponseDto) },
        },
      },
    },
  ],
};
