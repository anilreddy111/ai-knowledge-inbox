import logger from "../config/logger.js";

export function errorHandler(error, req, res, next) {
  logger.error(
    {
      err: error,
      method: req.method,
      url: req.url
    },
    "Request failed"
  );

  if (error.name === "ZodError") {
    return res.status(400).json({
      error: "Invalid request",
      code: "VALIDATION_ERROR",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  return res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR"
  });
}