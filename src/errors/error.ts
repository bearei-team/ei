import { HTTPError, HTTPErrorOptions } from './httpError';
import { TimeoutError } from './timeoutError';

export type CreateProcessErrorOptions = HTTPErrorOptions;

const enrichError = (
  error: Error,
  { request, response, options }: CreateProcessErrorOptions,
) =>
  error?.name === 'AbortError'
    ? new TimeoutError(request)
    : new HTTPError({ response, request, options });

export const CREATE_PROCESS_ERROR =
  (options: CreateProcessErrorOptions) =>
  (error: Error): never => {
    throw enrichError(error, options);
  };
