import type { FetchOptions, FetchResponse } from '@/core';

export interface EnrichedError
  extends Partial<Pick<FetchResponse, 'options' | 'status' | 'statusText'>> {
  /**
   * Error message description
   */
  message?: string;

  /**
   * Error name
   */
  name?: string;
}

const isAborted = (error: Record<string, unknown>): boolean =>
  (error.type as string)?.toLowerCase() === 'aborted' ||
  (error.message as string)
    ?.toLowerCase()
    .startsWith('the operation was aborted');

const enrichError = (
  error: Record<string, unknown>,
  options: FetchOptions,
): EnrichedError => ({
  ...error,
  ...(isAborted(error) && {
    status: 408,
    statusText: 'Timeout',
    message: 'Timeout',
    name: 'TimeoutError',
  }),
  options,
});

export const CREATE_PROCESS_ERROR =
  (options: FetchOptions) =>
  (error: unknown): never => {
    if (typeof error === 'object' && error !== null) {
      throw enrichError(error as Record<string, unknown>, options);
    }

    throw error;
  };
