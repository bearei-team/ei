import { OPTIONS_STORE } from './optionsStore';
import { OMIT } from './utils/omit.utils';

export interface CreatedHeaders {
  extractHeaders: typeof extractHeaders;
  processHeaders: typeof processHeaders;
}

const optionsStore = OPTIONS_STORE;
const createHeadersObject = (
  headers: HeadersInit = {},
): Record<string, string> => {
  if (headers instanceof Headers) {
    return extractHeaders([...headers.entries()]);
  }

  return Array.isArray(headers) ? extractHeaders(headers) : headers;
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

const extractHeaders = (
  headers: [string, string][],
): Record<string, string> => {
  return [...headers].reduce(
    (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
    {},
  );
};

const processHeaders = (headers: HeadersInit = {}): Record<string, string> => {
  const defaultHeaders: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    accept: '*/*',
  };

  const storeHeaders = optionsStore.get('headers');
  const createdStoreHeaders = createHeadersObject(storeHeaders);
  const createdHeaders = createHeadersObject(headers);

  return removeContentType(
    mergeHeaders(
      mergeHeaders(defaultHeaders, createdStoreHeaders),
      createdHeaders,
    ),
  );
};

const createHeaders = (): CreatedHeaders => ({
  extractHeaders,
  processHeaders,
});

export const HEADERS = createHeaders();
