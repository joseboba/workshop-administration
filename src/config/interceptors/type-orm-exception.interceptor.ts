import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TypeOrmExceptionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        switch (err.code) {
          case '23503':
            return throwError(
              () =>
                new BadRequestException(
                  'Registro cuenta con relaciones activas',
                ),
            );
        }
        return throwError(() => new InternalServerErrorException(err.message));
      }),
    );
  }
}
