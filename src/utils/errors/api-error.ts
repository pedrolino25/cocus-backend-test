export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
