import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import * as console from 'console';
import { Error } from 'mongoose';
import { MongoError, MongoServerError } from 'mongodb';

@Injectable()
export class TcpExceptionFilter implements BaseRpcExceptionFilter {
  catch(
    exception:
      | RpcException
      | BadRequestException
      | NotFoundException
      | ForbiddenException
      | GoneException
      | MongoServerError
      | MongoError,
    host: ArgumentsHost,
  ): Observable<any> {
    const ctx = host.switchToRpc();
    const pattern = ctx.getContext();
    const data = ctx.getData();
    console.log();
    console.log(exception, 'exception in filter', '***********');
    console.log();
    let error:
      | string
      | object
      | {
          status: string | number;
          extensions?: Record<string, unknown>;
        } = {
      message: exception.message,
      code: 'BAD_REQUEST',
    };
    console.log(exception.name);
    if (exception instanceof BadRequestException)
      error = {
        message:
          exception.getResponse()?.['msg'] ??
          exception.getResponse()?.['message'] ??
          exception.getResponse(),
        code: 'BAD_REQUEST',
      };
    console.log('hashtag#ERROR', error);
    if (exception instanceof RpcException) error = exception.getError();
    console.log(JSON.stringify(exception), error);

    if (exception.name === 'MongoServerError') {
      if ((exception as MongoServerError).code === 11000) {
        const key = Object.keys(exception['keyValue'])
          .join(', ')
          .split('.')
          .map((k) => toTitleCase(k))
          .join(' ');
        const value = Object.values(exception['keyValue']).join(', ');
        error = {
          // message: `${service.split(/(?=[A-Z])/)[0]} already exists!`,
          message: `${key}(${value}) already added, please try different one!`,
          code: 'BAD_REQUEST',
          extensions: {
            fields: exception['keyValue'],
          },
        };
      } else {
        error = {
          message: `Something went wrong`,
          code: 'INTERNAL_SERVER_ERROR',
        };
      }
    }

    if (exception instanceof NotFoundException) {
      error = {
        // message: `${service.split(/(?=[A-Z])/)[0]} already exists!`,
        message: exception.message,
        code: 'NOT_FOUND',
      };
    }

    console.error(
      `Microservice error on pattern ${pattern} with data ${JSON.stringify(
        data,
      )}: ${JSON.stringify(error)}`,
    );
    // const ctx2 = host.switchToHttp()
    // const response = ctx2.getResponse<Response>()
    // const status =
    // exception instanceof HttpException
    // ? exception.getStatus()
    // : HttpStatus.INTERNAL_SERVER_ERROR
    // const message2 =
    // exception instanceof HttpException ? exception.message : 'Internal Server Error'

    // return throwError(() => response.status(status).json(sendError(message2, status)))
    // return throwError(() => response.status(status).json(sendError(message2, status)))
    // if (this.isError(exception)) return this.handleUnknownError(exception, '500')
    return throwError(() => error);
  }

  handleUnknownError(exception: any, status: string): Observable<never> {
    console.log(status);

    console.error('Unknown error occurred:', exception);
    return throwError(() => new RpcException('Testing'));
  }

  isError(exception: any): exception is Error {
    console.log('########################### is Error');
    return exception instanceof Error;
  }
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
