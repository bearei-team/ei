import { EI, FetchOptions } from '../src/core';
import { ResponseError } from '../src/errors/responseError';

describe('EI', () => {
  let originalFetch: typeof fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('EI successfully fetches data', async () => {
    const responseData = { key: 'value' };
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });

    fetchMock.mockResolvedValue(response);

    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    const fetchResult = await EI(options.url!, options);
    expect(fetchResult.data).toEqual(responseData);
    expect(fetchResult.status).toEqual(200);
  });

  test('EI handles response error', async () => {
    const errorResponse = new Response('Not Found', { status: 404 });
    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    fetchMock.mockRejectedValue(
      new ResponseError({ response: errorResponse, options }),
    );

    const fetchResult = await EI(options.url!, options).catch(
      (error: ResponseError) => error,
    );

    expect(fetchResult.response.status).toEqual(404);
  });
});
