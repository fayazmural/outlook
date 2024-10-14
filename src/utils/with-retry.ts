import axios, { AxiosError } from "axios";
import {StatusCodes} from "http-status-codes"

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
}

/**
 * Executes a function with retry logic, handling rate limits and server errors.
 * @param fn The async function to execute.
 * @param config The retry configuration.
 * @returns The result of the function execution.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, baseDelay: 1000 }
): Promise<T> {
  let retries = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= config.maxRetries) {
        throw new Error(`Max retries (${config.maxRetries}) reached.`);
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const status = axiosError.response.status;
          if (status === StatusCodes.TOO_MANY_REQUESTS) {
            // Rate limit exceeded
            const retryAfter = parseInt(
              axiosError.response.headers["retry-after"] || "60",
              10
            );
            console.log(
              `Rate limit exceeded. Retrying after ${retryAfter} seconds.`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfter * 1000)
            );
          } else if (status >= StatusCodes.INTERNAL_SERVER_ERROR) {
            // Server error, retry with exponential backoff
            const delay = config.baseDelay * Math.pow(2, retries);
            console.log(`Server error (${status}). Retrying in ${delay}ms.`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // Other errors
            throw new Error(`Request failed: ${axiosError.message}`);
          }
        } else {
          // Network error or other issues
          throw new Error(`Request failed: ${axiosError.message}`);
        }
      } else {
        // Non-Axios error
        throw error;
      }
    }
    retries++;
  }
}
