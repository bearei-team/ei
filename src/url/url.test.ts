import processURL from '.';
import { option as globalOption } from '../option';

describe('processURL', () => {
  beforeEach(() => {
    globalOption.set({ baseURL: 'https://example.com' });
  });

  it('should process URL without query parameters', () => {
    const url = '/path/to/resource';
    const result = processURL(url);

    expect(result).toBe('https://example.com/path/to/resource');
  });

  it('should process URL with query parameters', () => {
    const url = '/path/to/resource';
    const option = { param: { foo: 'bar', baz: 123 } };
    const result = processURL(url, option);

    expect(result).toBe('https://example.com/path/to/resource?foo=bar&baz=123');
  });

  it('should encode query parameters if isEncode option is true', () => {
    const url = '/path/to/resource';
    const option = {
      param: { foo: 'hello world', bar: 'test@example.com' },
      isEncode: true,
    };

    const result = processURL(url, option);

    expect(result).toBe(
      'https://example.com/path/to/resource?foo=hello%20world&bar=test%40example.com',
    );
  });

  it('should not encode query parameters if isEncode option is false', () => {
    const url = '/path/to/resource';
    const option = {
      param: { foo: 'hello world', bar: 'test@example.com' },
      isEncode: false,
    };

    const result = processURL(url, option);

    expect(result).toBe(
      'https://example.com/path/to/resource?foo=hello world&bar=test@example.com',
    );
  });

  it('should process URL with base URL and query parameters', () => {
    const url = '/path/to/resource';
    const option = { param: { foo: 'bar' } };

    globalOption.set({ baseURL: 'https://example.com/api' });

    const result = processURL(url, option);

    expect(result).toBe('https://example.com/api/path/to/resource?foo=bar');
  });
});
