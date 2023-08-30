import type { FetchOptions, FetchResponse } from '@/core';

export enum Content {
  JSON = 'json',
  TEXT = 'text',
  OCTET_STREAM = 'octetStream',
  FILE = 'file',
}

export interface RequestResponse extends Pick<FetchOptions, 'headers'> {
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

const parseFunctionMap = {
  [Content.JSON]: (response: Response): Promise<unknown> => response.json(),
  [Content.TEXT]: (response: Response): Promise<string> => response.text(),
  [Content.FILE]: (response: Response): Promise<Blob> => response.blob(),
  [Content.OCTET_STREAM]: async (response: Response): Promise<unknown> => {
    const body = await response.text();

    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  },
};

const contentTypeMap: Record<string, keyof typeof Content> = {
  'application/json': 'JSON',
  'application/octet-stream': 'OCTET_STREAM',
  'text/html': 'TEXT',
  'text/plain': 'TEXT',
  'application/vnd.ms-excel': 'FILE',
};

const createProcessResponseData =
  (options: ProcessResponseDataOptions) =>
  async (
    type: keyof typeof Content,
    response: Response,
  ): Promise<FetchResponse> => {
    const data = await parseFunctionMap[Content[type]](response);
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

const getContentType = (contentType?: string): keyof typeof Content => {
  const contentTypeKey = Object.keys(contentTypeMap).find(key =>
    contentType?.startsWith(key),
  );

  return contentTypeKey ? contentTypeMap[contentTypeKey] : 'TEXT';
};

export const CREATE_PROCESS_RESPONSE =
  (options: FetchOptions) =>
  async (response: Response): Promise<FetchResponse> => {
    const { status, statusText, url } = response;
    const headers = extractHeaders(response);
    const contentType = headers['content-type'];
    const type = getContentType(contentType);
    const processResponseData = createProcessResponseData({
      status,
      statusText,
      headers,
      url,
      options,
    });

    return processResponseData(type, response);
  };
