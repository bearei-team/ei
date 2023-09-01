import { FetchOptions } from '../../src/core';
import { HTTPError } from '../../src/errors/httpError';

describe('HTTPError', () => {
  test('It should create an instance of HTTPError', () => {
    const response = new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });

    const request = new Request('https://example.com/api');
    const options = { method: 'GET' as FetchOptions['method'] };
    const httpError = new HTTPError({ response, request, options });

    expect(httpError).toBeInstanceOf(HTTPError);
    expect(httpError.message).toBe(
      'Request failed with status code 404 Not Found',
    );

    expect(httpError.name).toBe('HTTPError');
    expect(httpError.response).toBe(response);
    expect(httpError.request).toBe(request);
    expect(httpError.options).toBe(options);
  });

  test('It should create an instance of HTTPError with a default message', () => {
    const response = new Response('', { status: 500 });
    const request = new Request('https://example.com/api');
    const options = { method: 'POST' as FetchOptions['method'] };
    const httpError = new HTTPError({ response, request, options });

    expect(httpError).toBeInstanceOf(HTTPError);
    expect(httpError.message).toBe('Request failed with status code 500');
  });
});
