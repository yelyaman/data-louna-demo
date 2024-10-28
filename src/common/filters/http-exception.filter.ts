import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const validationErrorArray = exception.getResponse()['message'];
    if (validationErrorArray)
      response.status(status).json({
        statusCode: status,
        errorMessage: exception.message,
        validationErrors: validationErrorArray,
        timestamp: new Date().toISOString(),
        path: request.url,
        stack: exception.stack,
      });
    else
      response.status(status).json({
        statusCode: status,
        errorMessage: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        stack: exception.stack,
      });
  }
}
