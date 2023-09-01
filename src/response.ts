import type { FetchOptions, FetchResponse } from '@/core';
import { ResponseError } from './errors/responseError';
import { EXTRACT_HEADERS } from './headers';

export type CreateProcessResponseOptions = Pick<FetchResponse, 'request'> &
  FetchOptions;

export interface ProcessResponseDataOptions
  extends Pick<FetchResponse, 'request' | 'url' | 'headers'> {
  options: FetchOptions;

  /**
   * HTTP response status codes.
   */
  status: number;

  /**
   * HTTP response status code description text.
   */
  statusText: string;
}

export enum Content {
  JSON = 'json',
  TEXT = 'text',
}

const parseFunctionMap = {
  [Content.JSON]: (response: Response): Promise<unknown> => response.json(),
  [Content.TEXT]: (response: Response): Promise<string> => response.text(),
};

const contentTypeMap: Record<string, keyof typeof Content> = {
  'application/json': 'JSON',
  'text/html': 'TEXT',
  'text/plain': 'TEXT',
};

const createProcessResponseData =
  (options: ProcessResponseDataOptions) =>
  async (
    type: keyof typeof Content,
    response: Response,
  ): Promise<FetchResponse> => {
    const data = await parseFunctionMap[Content[type]](response);
    const processedResponse = { ...options, data, response };

    return response.ok
      ? processedResponse
      : Promise.reject(new ResponseError({ response, options }));
  };

const getContentType = (contentType?: string): keyof typeof Content => {
  const contentTypeKey = Object.keys(contentTypeMap).find(key =>
    contentType?.startsWith(key),
  );

  return contentTypeKey ? contentTypeMap[contentTypeKey] : 'TEXT';
};

export const CREATE_PROCESS_RESPONSE =
  ({ request, ...args }: CreateProcessResponseOptions) =>
  async (response: Response): Promise<FetchResponse> => {
    const { status, statusText, url } = response;
    const headers = EXTRACT_HEADERS([...response.headers.entries()]);
    const contentType = headers['content-type'];
    const type = getContentType(contentType);
    const processResponseData = createProcessResponseData({
      request,
      status,
      statusText,
      headers,
      url,
      options: args,
    });

    return processResponseData(type, response);
  };
