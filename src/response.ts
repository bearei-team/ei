import type { FetchResponse, ProcessedFetchOptions } from '@/core';
import { ERROR } from './error';
import { HEADERS } from './headers';

export type CreateProcessResponseOptions = Pick<FetchResponse, 'request'> &
  ProcessedFetchOptions;

export type ProcessResponseDataOptions = Omit<FetchResponse, 'data'>;

export interface CreatedResponse {
  createProcessResponse: typeof createProcessResponse;
}

export enum Content {
  JSON = 'json',
  TEXT = 'text',
}

const { extractHeaders } = HEADERS;
const { createResponseError } = ERROR;
const processResponseData = async (
  type: keyof typeof Content,
  { response, ...args }: ProcessResponseDataOptions,
): Promise<FetchResponse> => {
  const parseFunctionMap = {
    [Content.JSON]: (response: Response): Promise<unknown> => response.json(),
    [Content.TEXT]: (response: Response): Promise<string> => response.text(),
  };

  const data = await parseFunctionMap[Content[type]](response);
  const processedResponse = { ...args, data, response };

  return response.ok
    ? processedResponse
    : Promise.reject(createResponseError(processedResponse));
};

const getContentType = (contentType?: string): keyof typeof Content => {
  const contentTypeMap: Record<string, keyof typeof Content> = {
    'application/json': 'JSON',
    'text/html': 'TEXT',
    'text/plain': 'TEXT',
  };

  const content = Object.entries(contentTypeMap).find(([key]) =>
    contentType?.startsWith(key),
  )?.[1];

  return content ?? 'TEXT';
};

const createProcessResponse =
  ({ request, ...args }: CreateProcessResponseOptions) =>
  async (response: Response): Promise<FetchResponse> => {
    const { status, statusText, url } = response;
    const headers = extractHeaders([...response.headers.entries()]);
    const contentType = headers['content-type'];
    const type = getContentType(contentType);

    return processResponseData(type, {
      response,
      request,
      status,
      statusText,
      headers,
      url,
      options: args,
    });
  };

const createResponse = (): CreatedResponse => ({
  createProcessResponse,
});

export const RESPONSE = createResponse();
