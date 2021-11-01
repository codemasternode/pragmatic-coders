export type HttpErrorResponseBody = { message: string; kind?: string };

export class HttpErrorResponse<
  T extends HttpErrorResponseBody = HttpErrorResponseBody
> extends Error {
  constructor(readonly statusCode: number, readonly body: T) {
    super(body.message);
    Object.setPrototypeOf(this, HttpErrorResponse.prototype);
  }
}

export type TransformErrorResponseBody = { message: string; validationErrors: unknown };

export class TransformError<
  T extends TransformErrorResponseBody = TransformErrorResponseBody
> extends Error {
  validationErrors: unknown;

  constructor(readonly statusCode: number, readonly body: T) {
    super(body.message);
    this.validationErrors = body.validationErrors;
    Object.setPrototypeOf(this, HttpErrorResponse.prototype);
  }
}
