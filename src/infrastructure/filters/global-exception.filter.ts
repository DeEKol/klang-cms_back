import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode: number;
        let message: string;
        let error: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const body = exception.getResponse();
            message =
                typeof body === "string"
                    ? body
                    : ((body as { message?: string }).message ?? exception.message);
            error = exception.name.replace("Exception", "");
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Internal server error";
            error = "InternalServerError";
            this.logger.error(`Unhandled exception on ${request.method} ${request.url}`, exception);
        }

        response.status(statusCode).json({
            statusCode,
            error,
            message,
        });
    }
}
