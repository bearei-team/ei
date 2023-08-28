import type { FetchOptions } from '@/core';
export type ProcessErrorOptions = FetchOptions;

export interface EnrichErrorResult {
  status?: number;
  statusText?: string;
  message?: string;
  name?: string;
  options: FetchOptions;
}

const isAborted = (error: Record<string, unknown>): boolean =>
  (error.type as string)?.toLowerCase() === 'aborted' ||
  (error.message as string)
    ?.toLowerCase()
    .startsWith('the operation was aborted');

const enrichError = (
  error: Record<string, unknown>,
  options: ProcessErrorOptions,
): EnrichErrorResult => ({
  ...error,
  options,
  ...(isAborted(error)
    ? {
        status: 408,
        statusText: 'Timeout',
        message: 'Timeout',
        name: 'TimeoutError',
      }
    : {}),
});

export const processError =
  (options: ProcessErrorOptions) =>
  (error: unknown): never => {
    if (typeof error === 'object' && error !== null) {
      throw enrichError(error as Record<string, unknown>, options);
    }

    throw error;
  };
