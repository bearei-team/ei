import type { FetchResponse, ProcessedFetchOptions } from '@/core';
import { ERROR } from './error';
import { HEADERS } from './headers';

export type CreateProcessResponseOptions = Pick<FetchResponse, 'request'> &
  ProcessedFetchOptions;

export type ProcessResponseDataOptions = Omit<
  FetchResponse,
  'data' | 'response'
>;

export interface CreatedResponse {
  createProcessResponse: typeof createProcessResponse;
}

export enum Content {
  JSON = 'json',
  TEXT = 'text',
}

const { extractHeaders } = HEADERS;
const { createResponseError } = ERROR;
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
      : Promise.reject(createResponseError(processedResponse));
  };

const getContentType = (contentType?: string): keyof typeof Content => {
  const contentTypeKey = Object.keys(contentTypeMap).find(key =>
    contentType?.startsWith(key),
  );

  return contentTypeKey ? contentTypeMap[contentTypeKey] : 'TEXT';
};

const createProcessResponse =
  ({ request, ...args }: CreateProcessResponseOptions) =>
  async (response: Response): Promise<FetchResponse> => {
    const { status, statusText, url } = response;
    const headers = extractHeaders([...response.headers.entries()]);
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

const createResponse = (): CreatedResponse => ({
  createProcessResponse,
});

export const RESPONSE = createResponse();
