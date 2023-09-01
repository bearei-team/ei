import * as globalOption from './options';
import { OMIT } from './utils/omit.utils';

const defaultHeaders: Record<string, string> = {
  'content-type': 'application/json; charset=utf-8',
  accept: '*/*',
};

const createHeadersObject = (
  headers: HeadersInit = {},
): Record<string, string> => {
  if (headers instanceof Headers) {
    return EXTRACT_HEADERS([...headers.entries()]);
  }

  return Array.isArray(headers) ? EXTRACT_HEADERS(headers) : headers;
};

const mergeHeaders = <T extends Record<string, string>>(
  defaultHeaders: T,
  customHeaders: T,
): T => ({
  ...defaultHeaders,
  ...customHeaders,
});

const removeContentType = <T extends Record<string, string>>(headers: T): T => {
  if (headers?.['content-type']?.startsWith('multipart/form-data')) {
    const omittedHeaders = OMIT(headers, ['content-type']);

    return omittedHeaders as T;
  }

  return headers;
};

export const EXTRACT_HEADERS = (
  headers: [string, string][],
): Record<string, string> => {
  return [...headers].reduce(
    (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
    {},
  );
};

export const PROCESS_HEADERS = (
  headers: HeadersInit = {},
): Record<string, string> => {
  const globalHeaders = globalOption.get('headers');
  const createdGlobalHeaders = createHeadersObject(globalHeaders);
  const newHeaders = createHeadersObject(headers);

  return removeContentType(
    mergeHeaders(
      mergeHeaders(defaultHeaders, createdGlobalHeaders),
      newHeaders,
    ),
  );
};
