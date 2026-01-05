export enum ErrorCodes {
  InternalServerError = "INTERNAL_SERVER_ERROR",
  InvalidAcceptHeader = "INVALID_ACCEPT_HEADER",
  InvalidQueryParameter = "INVALID_QUERY_PARAMETER",
  MissingParameter = "MISSING_REQUIRED_PARAMETER",
  ExternalServiceError = "EXTERNAL_SERVICE_ERROR",
}

export enum ErrorMessages {
  InternalServerError = "An unexpected error occurred",
  InvalidAcceptHeader = "Accept header must be application/json",
  InvalidQueryParameter = "Query parameter '$1' must be $2",
  MissingParameter = "Missing required parameter '$1'",
  ExternalServiceError = "External service returned an error",
}
