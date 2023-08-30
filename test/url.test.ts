import * as globalOptions from '../src/options';
import { PROCESS_URL } from '../src/url';

describe('processURL', () => {
  beforeEach(() => {
    globalOptions.set('baseUrl', 'https://example.com');
  });

  it('should process URL without query parameters', () => {
    const url = '/path/to/resource';
    const result = PROCESS_URL(url);

    expect(result).toBe('https://example.com/path/to/resource');
  });

  it('should process URL with query parameters', () => {
    const url = '/path/to/resource';
    const options = { param: { foo: 'bar', baz: 123 } };
    const result = PROCESS_URL(url, options);

    expect(result).toBe('https://example.com/path/to/resource?foo=bar&baz=123');
  });

  it('should encode query parameters if isEncode options is true', () => {
    const url = '/path/to/resource';
    const options = {
      param: { foo: 'hello world', bar: 'test@example.com' },
      isEncode: true,
    };

    const result = PROCESS_URL(url, options);

    expect(result).toBe(
      'https://example.com/path/to/resource?foo=hello%20world&bar=test%40example.com',
    );
  });

  it('should not encode query parameters if isEncode options is false', () => {
    const url = '/path/to/resource';
    const options = {
      param: { foo: 'hello world', bar: 'test@example.com' },
      isEncode: false,
    };

    const result = PROCESS_URL(url, options);

    expect(result).toBe(
      'https://example.com/path/to/resource?foo=hello world&bar=test@example.com',
    );
  });

  it('should process URL with base URL and query parameters', () => {
    const url = '/path/to/resource';
    const options = { param: { foo: 'bar' } };

    globalOptions.set('baseUrl', 'https://example.com/api');

    const result = PROCESS_URL(url, options);

    expect(result).toBe('https://example.com/api/path/to/resource?foo=bar');
  });
});
