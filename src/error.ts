import type { FetchOptions, FetchResponse } from '@/core';

export interface EnrichErrorResult
  extends Partial<Pick<FetchResponse, 'options' | 'status' | 'statusText'>> {
  /**
   * Error message description
   */
  message?: string;

  /**
   * Error name
   */
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
  options: FetchOptions,
): EnrichErrorResult => ({
  ...error,
  ...(isAborted(error) && {
    status: 408,
    statusText: 'Timeout',
    message: 'Timeout',
    name: 'TimeoutError',
  }),
  options,
});

export const processError =
  (options: FetchOptions) =>
  (error: unknown): never => {
    if (typeof error === 'object' && error !== null) {
      throw enrichError(error as Record<string, unknown>, options);
    }

    throw error;
  };
