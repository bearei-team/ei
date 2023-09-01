import { CREATE_PROCESS_ERROR } from '../../src/errors/error';
import { HTTPError } from '../../src/errors/httpError';
import { TimeoutError } from '../../src/errors/timeoutError';

describe('CREATE_PROCESS_ERROR', () => {
  test('It should create a TimeoutError for AbortError', () => {
    const request = new Request('https://example.com/api');
    const error = new Error('The operation was aborted.');
    error.name = 'AbortError';

    const options = { request, response: undefined, options: {} };

    const createError = CREATE_PROCESS_ERROR(options);

    expect(() => createError(error)).toThrow(TimeoutError);
  });

  test('It should create an HTTPError for other errors', () => {
    const request = new Request('https://example.com/api');
    const response = new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });

    const error = new Error('An error occurred.');
    const options = { request, response, options: {} };
    const createError = CREATE_PROCESS_ERROR(options);

    expect(() => createError(error)).toThrow(HTTPError);
  });
});
