import { ApiError } from "./ApiError";
import * as Sentry from "@sentry/react";

export function logError(error: unknown, contextMessage?: string) {
  if (import.meta.env.VITE_IS_DEVELOPMENT) {
    if (error instanceof ApiError) {
      console.error("API Error:", {
        status: error.statusCode,
        message: error.message,
        errorCode: error.errorCode,
      });
      return;
    }

    console.error(contextMessage ? `${contextMessage}:` : "Error:", error);
  } else {
    Sentry.captureException(error);
  }
}
