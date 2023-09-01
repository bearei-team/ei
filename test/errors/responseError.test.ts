import { FetchOptions } from '../../src/core';
import { ResponseError } from '../../src/errors/responseError';

describe('ResponseError', () => {
  test('It should create an instance of ResponseError', () => {
    const response = new Response('Not Found', { status: 404 });
    const options = { method: 'GET' as FetchOptions['method'] };
    const responseError = new ResponseError({ response, options });

    expect(responseError).toBeInstanceOf(ResponseError);
    expect(responseError.message).toBe('Request response failed');
    expect(responseError.name).toBe('ResponseError');
    expect(responseError.response).toBe(response);
    expect(responseError.options).toBe(options);
  });
});
