import { CustomError } from "../utils/custom_error.mjs";
import { logError } from "../utils/logger.mjs";

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  logError(err);

  // ===========================
  // Custom Error
  // ===========================

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
    });
  }

  // ===========================
  // Mongoose Validation
  // ===========================

  if (err.name === "ValidationError") {
    const errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      data: errors,
    });
  }

  // ===========================
  // Duplicate Key
  // ===========================

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      data: err.keyValue,
    });
  }

  // ===========================
  // Invalid ObjectId
  // ===========================

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }

  // ===========================
  // Fetch / Network Error
  // ===========================

  if (
    err.name === "FetchError" ||
    err.code === "ECONNREFUSED" ||
    err.code === "ETIMEDOUT"
  ) {
    return res.status(503).json({
      success: false,
      message: "External service unavailable",
    });
  }

  // ===========================
  // Unknown Error
  // ===========================

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};