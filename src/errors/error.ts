import { HTTPError, HTTPErrorOptions } from './httpError';
import { ResponseErrorOptions } from './responseError';
import { TimeoutError } from './timeoutError';

export type CreateProcessErrorOptions = Omit<HTTPErrorOptions, 'response'> &
  Partial<Omit<ResponseErrorOptions, 'options'>>;

const enrichError = (
  error: Error,
  { request, response, options }: CreateProcessErrorOptions,
) =>
  error?.name === 'AbortError'
    ? new TimeoutError(request)
    : new HTTPError({ response: response!, request, options });

export const CREATE_PROCESS_ERROR =
  (options: CreateProcessErrorOptions) =>
  (error: Error): never => {
    throw enrichError(error, options);
  };
