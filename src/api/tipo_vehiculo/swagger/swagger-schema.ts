import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { TipoVehiculo } from '../entities/tipo_vehiculo.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(TipoVehiculo) },
        },
      },
    },
  ],
};
