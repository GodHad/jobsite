import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class CustomValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    const validationErrors = exceptionResponse.message;

    const isValidationError = Array.isArray(validationErrors) && validationErrors.some(item => typeof item === 'string');

    if (status === HttpStatus.BAD_REQUEST && isValidationError) {
      return response.status(status).json({
        statusCode: status,
        message: "Your profile is not completed. Please complete your profile.",
        error: 'Bad Request',
      });
    }

    return response.status(status).json(exceptionResponse);
  }
}
