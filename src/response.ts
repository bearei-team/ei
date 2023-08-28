import type { FetchOptions, FetchResponse } from '@/core';

export type ContentType = 'json' | 'text' | 'octetStream' | 'file';
export interface ProcessResponseOptions extends Omit<FetchOptions, 'headers'> {
  /**
   * Custom request headers
   */
  headers?: Record<string, string>;
}

export interface RequestResponse
  extends Pick<ProcessResponseOptions, 'headers'> {
  /**
   * Response HTTP status code
   */
  status: number;

  /**
   * Response HTTP status code description
   */
  statusText: string;

  /**
   * The server URL to use for the request
   */
  url: string;
}

export interface ProcessResponseDataOptions extends RequestResponse {
  options: FetchOptions;
}

const parseFunctionMap: Record<
  ContentType,
  (response: Response) => Promise<unknown>
> = {
  json: (response: Response): Promise<unknown> => response.json(),
  text: (response: Response): Promise<string> => response.text(),
  file: (response: Response): Promise<Blob> => response.blob(),
  octetStream: async (response: Response): Promise<unknown> => {
    const body = await response.text();

    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  },
};

const contentTypeMap: Record<string, ContentType> = {
  'application/json': 'json',
  'application/octet-stream': 'octetStream',
  'text/html': 'text',
  'text/plain': 'text',
  'application/vnd.ms-excel': 'file',
};

const processResponseData = async (
  response: Response,
  type: ContentType,
  options: ProcessResponseDataOptions,
): Promise<FetchResponse> => {
  const data = await parseFunctionMap[type](response);
  const result = { ...options, data };

  return response.ok
    ? result
    : Promise.reject({ ...result, name: 'HTTPError' });
};

const extractHeaders = (response: Response): Record<string, string> =>
  [...response.headers.entries()].reduce(
    (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
    {},
  );

const getContentType = (contentType?: string): ContentType => {
  const contentTypeKey = Object.keys(contentTypeMap).find(key =>
    contentType?.startsWith(key),
  );

  return contentTypeKey ? contentTypeMap[contentTypeKey] : 'text';
};

export const processResponse =
  (options: ProcessResponseOptions) =>
  async (response: Response): Promise<FetchResponse> => {
    const { status, statusText, url } = response;
    const headers = extractHeaders(response);
    const contentType = headers['content-type'];
    const type = getContentType(contentType);

    return processResponseData(response, type, {
      status,
      statusText,
      headers,
      url,
      options,
    });
  };
