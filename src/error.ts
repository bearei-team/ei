import { FetchResponse } from './core';
import {
  CreateProcessResponseOptions,
  ProcessResponseDataOptions,
} from './response';

export type CreateErrOptions = Partial<Omit<FetchResponse, 'request'>> &
  Pick<FetchResponse, 'request'>;

export type Err = Partial<Error> & CreateErrOptions;
export type CreateProcessErrorOptions = CreateProcessResponseOptions;
export type EnrichErrorOptions = Omit<
  ProcessResponseDataOptions,
  'status' | 'statusText' | 'response'
>;

export interface CreatedError {
  createProcessError: typeof createProcessError;
  createResponseError: typeof createResponseError;
}

const createErr = (error: Err): Err => Object.assign(new Error(), error);
const createHTTPError = ({
  status,
  statusText = '',
  ...args
}: CreateErrOptions): Err => {
  const code = status || typeof status === 'number' ? status : '';
  const statusCode = `${code} ${statusText}`.trim();
  const reason = statusCode ? `status code ${statusCode}` : 'an unknown error';

  return createErr({
    ...args,
    name: 'HTTPError',
    message: `Request failed with ${reason}`,
    status,
    statusText,
  });
};

const createTimeoutError = (options: CreateErrOptions): Err =>
  createErr({ ...options, name: 'TimeoutError', message: 'TimeoutError' });

const createResponseError = (options: CreateErrOptions): Err =>
  createErr({
    ...options,
    name: 'ResponseError',
    message: 'Request response failed',
  });

const enrichError = (error: Err, options: EnrichErrorOptions): Err =>
  error.name === 'AbortError'
    ? createTimeoutError({
        ...error,
        ...options,
        status: 408,
        statusText: 'Request Timeout',
        data: 'Request Timeout',
      })
    : createHTTPError(error);

const createProcessError =
  ({ request, ...args }: CreateProcessErrorOptions) =>
  (error: Err): never => {
    throw enrichError(error, { request, options: args, url: args.url });
  };

const createError = (): CreatedError => ({
  createProcessError,
  createResponseError,
});

export const ERROR = createError();
