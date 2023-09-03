import { Err, ERROR } from '../src/error';

const { createProcessError, createResponseError } = ERROR;

describe('error', () => {
  it('It should throw an enhanced TimeoutError for AbortError', () => {
    const request = new Request('https://example.com', { method: 'GET' });
    const errorOptions: Err = {
      name: 'AbortError',
      request,
    };

    const createProcessErrorFn = createProcessError({
      request,
      url: 'https://example.com',
    });

    expect(() => createProcessErrorFn(errorOptions)).toThrowError(
      'TimeoutError',
    );

    const thrownError = () => {
      try {
        createProcessErrorFn(errorOptions);
      } catch (e) {
        return e as Err;
      }
    };

    const result = thrownError();

    expect(result?.name).toBe('TimeoutError');
    expect(result?.status).toBe(408);
    expect(result?.statusText).toBe('Request Timeout');
  });

  it('It should create an HTTPError with status code and status text', () => {
    const request = new Request('https://example.com', { method: 'GET' });
    const errorOptions: Err = {
      status: 404,
      statusText: 'Not Found',
      request,
    };

    const createProcessErrorFn = createProcessError({
      request,
      url: 'https://example.com',
    });

    expect(() => createProcessErrorFn(errorOptions)).toThrowError(
      'Request failed with status code 404 Not Found',
    );

    const thrownError = () => {
      try {
        createProcessErrorFn(errorOptions);
      } catch (e) {
        return e as Err;
      }
    };

    const result = thrownError();

    expect(result?.name).toBe('HTTPError');
    expect(result?.status).toBe(404);
    expect(result?.statusText).toBe('Not Found');
  });

  it('It should create a ResponseError with status code and status text', () => {
    const request = new Request('https://example.com', { method: 'GET' });

    const errorOptions: Err = {
      status: 404,
      statusText: '',
      request,
    };

    expect(() => {
      throw createResponseError(errorOptions);
    }).toThrowError('Request response failed');

    const thrownError = () => {
      try {
        throw createResponseError(errorOptions);
      } catch (e) {
        return e as Err;
      }
    };

    const result = thrownError();

    expect(result?.name).toBe('ResponseError');
    expect(result?.status).toBe(404);
    expect(result?.statusText).toBe('');
  });
});
