import * as globalOption from '../option';
import type { Header, Headers } from './header.interface';

const createHeaderObject = <T extends Headers>(headers: T) =>
  Array.isArray(headers)
    ? headers.reduce(
        (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
        {},
      )
    : (headers as Record<string, string>);

const mergeHeader = (defaultHeader: Header, customHeader: Header) => ({
  ...defaultHeader,
  ...customHeader,
});

const removeContentType = (header: Header) => {
  if (header['content-type']?.startsWith('multipart/form-data')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { 'content-type': _, ...rest } = header;

    return rest;
  }

  return header;
};

const defaultHeader: Header = {
  'content-type': 'application/json; charset=utf-8',
  accept: '*/*',
};

const processHeader = (options: Headers = {}) => {
  const headers = globalOption.get('headers') as Headers;
  const configHeader = createHeaderObject(headers);
  const newHeader = createHeaderObject(options);

  return removeContentType(
    mergeHeader(mergeHeader(defaultHeader, configHeader), newHeader),
  );
};

export default processHeader;
