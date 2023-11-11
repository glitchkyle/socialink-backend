import { ValidationError } from "class-validator";

// Error object used in error handling middleware function
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

export class ValidationException extends AppError {
    data: ValidationError[];
    constructor(public readonly errors: ValidationError[]) {
        super("Validation Failed", 400);
        this.data = errors;
    }
}

// General unexplainable error
export class ServerError extends AppError {
    constructor(message = "Something went wrong") {
        super(message, 500);
    }
}

// When a field or join was expected but not performed
export class MissingFieldError extends AppError {
    constructor(message = "Server encountered a missing field") {
        super(message, 500);
    }
}

// When a resource could not be found
export class ResourceNotFoundError extends AppError {
    constructor(message = "Resource could not be found") {
        super(message, 404);
    }
}

// When a user is authenticated but not permitted to perform the action
export class UnauthorizedError extends AppError {
    constructor(message = "Not authorized to perform this action") {
        super(message, 403);
    }
}

// When a user is unauthenticated but login is required for the action
export class UnauthenticatedError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

// When a request contains invalid input (e.g. number instead of string)
export class BadRequestError extends AppError {
    constructor(message = "Invalid or missing request parameters") {
        super(message, 400);
    }
}

// When a request was understood but violates business logic
export class RejectedRequestError extends AppError {
    constructor(message = "Request conflicts with rules for this action") {
        super(message, 409);
    }
}
