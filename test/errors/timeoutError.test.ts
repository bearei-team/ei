import { TimeoutError } from '../../src/errors/timeoutError';

describe('TimeoutError', () => {
  test('It should create an instance of TimeoutError', () => {
    const request = new Request('https://example.com/api');
    const timeoutError = new TimeoutError(request);

    expect(timeoutError).toBeInstanceOf(TimeoutError);
    expect(timeoutError.message).toBe('Request timed out');
    expect(timeoutError.name).toBe('TimeoutError');
    expect(timeoutError.request).toBe(request);
  });
});
