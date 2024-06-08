class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Something Went Wrong!",
    errors = [],
    stack
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if(stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
