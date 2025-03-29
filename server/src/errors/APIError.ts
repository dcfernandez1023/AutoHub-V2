class APIError extends Error {
  statusCode: number;

  constructor(m: string, statusCode: number) {
    super(m);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export default APIError;
