export class ApiError extends Error {
  public statusCode: number;
  public errorCode?: string;

  constructor(statusCode: number, message: string, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode || undefined;
  }

  static fromResponse(
    data: { message: string; errorCode?: string },
    statusCode: number,
  ): ApiError {
    return new ApiError(statusCode, data.message, data.errorCode);
  }
}
