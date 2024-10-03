import { getSchemaPath } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../../commons';
import { ServicioOrdenTrabajo } from '../../../administration/servicio_orden_trabajo/entities/servicio_orden_trabajo.entity';

export const findAllSchema = {
  allOf: [
    { $ref: getSchemaPath(PaginationResponseDto) },
    {
      properties: {
        content: {
          type: 'array',
          items: { $ref: getSchemaPath(ServicioOrdenTrabajo) },
        },
      },
    },
  ],
};
