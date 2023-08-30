import type { FetchOptions } from '@/core';
import * as globalOption from './options';
import { OMIT } from './utils/omit.utils';

export type Headers = FetchOptions['headers'];

const createHeadersObject = <T extends Headers>(
  headers: T,
): Record<string, string> =>
  Array.isArray(headers)
    ? headers.reduce(
        (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
        {},
      )
    : headers;

const mergeHeaders = (
  defaultHeaders: Headers,
  customHeaders: Headers,
): Headers => ({
  ...defaultHeaders,
  ...customHeaders,
});

const removeContentType = (headers: Headers): Headers => {
  if (headers?.['content-type']?.startsWith('multipart/form-data')) {
    const omittedHeaders = OMIT(headers, ['content-type']);

    return omittedHeaders;
  }

  return headers;
};

const defaultHeaders: Record<string, string> = {
  'content-type': 'application/json; charset=utf-8',
  accept: '*/*',
};

export const PROCESS_HEADERS = (options: Headers = {}): Headers => {
  const headers = globalOption.get('headers');
  const globalHeaders = createHeadersObject(headers);
  const newHeaders = createHeadersObject(options);

  return removeContentType(
    mergeHeaders(mergeHeaders(defaultHeaders, globalHeaders), newHeaders),
  );
};
