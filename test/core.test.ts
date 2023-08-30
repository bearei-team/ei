import { FetchOptions, EI as ei } from '../src/core';
import { HTTPError } from '../src/errors/httpError';
import { ResponseError } from '../src/errors/responseError';

describe('createdFetch', () => {
  let originalFetch: typeof fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('createdFetch successfully fetches data', async () => {
    const responseData = { key: 'value' };
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    fetchMock.mockResolvedValue(response);

    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    const fetchResult = await ei(options.url!, options);

    expect(fetchResult.data).toEqual(responseData);
    expect(fetchResult.status).toEqual(200);
  });

  test('createdFetch handles response error', async () => {
    const errorResponse = new Response('Not Found', {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    fetchMock.mockRejectedValue(
      new ResponseError({ response: errorResponse, options }),
    );

    const fetchResult = await ei(options.url!, options).catch(
      (err: HTTPError) => err,
    );

    expect(fetchResult.response.status).toEqual(404);
  });
});
