/**
 * Enhanced fetch utility with timeout and retry capabilities
 */
export interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Fetch with timeout and retry functionality
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const {
    timeout = 10000,
    retries = 1,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // If it's the last attempt or a 4xx error, don't retry
      if (
        attempt === retries ||
        (response.status >= 400 && response.status < 500)
      ) {
        return response;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // If it's the last attempt, throw the error
      if (attempt === retries) {
        if (isAbortError(error)) {
          throw new Error(`Request timed out after ${timeout}ms`);
        }
        throw error instanceof Error ? error : new Error(String(error));
      }

      // Wait before retrying (only for network errors, not timeouts)
      if (!isAbortError(error)) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw new Error("Max retries exceeded");
}

/**
 * Fetch JSON with timeout and error handling
 */
export async function fetchJSON<T = any>(
  url: string,
  options: FetchOptions = {},
): Promise<{ data: T; success: boolean; error?: string }> {
  try {
    const response = await fetchWithTimeout(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        data: null as T,
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      data: null as T,
      success: false,
      error: toErrorMessage(error) || "Network error occurred",
    };
  }
}

/**
 * POST request with JSON data and timeout
 */
export async function postJSON<T = any>(
  url: string,
  data: any,
  options: Omit<FetchOptions, "method" | "body"> = {},
): Promise<{ data: T; success: boolean; error?: string }> {
  return fetchJSON<T>(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}
