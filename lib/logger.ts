import { v4 as uuidv4 } from "uuid";

export interface LogContext {
  requestId: string;
  userId?: string;
  method: string;
  path: string;
}

/**
 * Structured logger for API routes.
 */
export function createRequestLogger(
  method: string,
  path: string,
  userId?: string,
): LogContext & { info: (msg: string, extra?: Record<string, unknown>) => void; warn: (msg: string, extra?: Record<string, unknown>) => void; error: (msg: string, extra?: Record<string, unknown>) => void } {
  const ctx: LogContext = {
    requestId: uuidv4(),
    userId,
    method,
    path,
  };

  const log = (
    level: "info" | "warn" | "error",
    msg: string,
    extra?: Record<string, unknown>,
  ) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      ...ctx,
      message: msg,
      ...extra,
    };
    if (level === "error") {
      console.error(JSON.stringify(entry));
    } else if (level === "warn") {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  };

  return {
    ...ctx,
    info: (msg, extra) => log("info", msg, extra),
    warn: (msg, extra) => log("warn", msg, extra),
    error: (msg, extra) => log("error", msg, extra),
  };
}
