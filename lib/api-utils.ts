import { NextResponse } from "next/server";
import { type ZodSchema } from "zod";

/**
 * Parse and validate request body against a Zod schema.
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      error: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 },
      ),
    };
  }

  return { data: result.data };
}

/**
 * Parse query params from a URL against a Zod schema.
 */
export function parseQuery<T>(
  url: string,
  schema: ZodSchema<T>,
): { data: T } | { error: NextResponse } {
  const params = Object.fromEntries(new URL(url).searchParams);
  const result = schema.safeParse(params);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: "Invalid query parameters", details: result.error.flatten() },
        { status: 400 },
      ),
    };
  }
  return { data: result.data };
}
