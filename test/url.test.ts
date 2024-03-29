import { CREATED_URL } from '../src/url';

const { processURL } = CREATED_URL;
describe('url', () => {
  test('It should process a simple URL without params', () => {
    const url = 'https://example.com/api';
    const result = processURL(url);

    expect(result).toBe(url);
  });

  test('It should process a URL with params', () => {
    const url = 'https://example.com/api';
    const param = {
      param1: 'value1',
      param2: 'value2',
    };

    const expectedURL = `${url}?param1=value1&param2=value2`;
    const result = processURL(url, { param });

    expect(result).toBe(expectedURL);
  });

  test('It should process a URL with URL-encoded params', () => {
    const url = 'https://example.com/api';
    const param = {
      param1: 'value with spaces',
      param2: 42,
    };

    const expectedURL = `${url}?param1=value%20with%20spaces&param2=42`;
    const result = processURL(url, { param });

    expect(result).toBe(expectedURL);
  });

  test('It should not encode params if isEncode is false', () => {
    const url = 'https://example.com/api';
    const params = {
      param1: 'value with spaces',
      param2: 42,
    };

    const expectedURL = `${url}?param1=value with spaces&param2=42`;
    const result = processURL(url, { param: params, isEncode: false });

    expect(result).toBe(expectedURL);
  });

  test('It should handle URL with existing params', () => {
    const url = 'https://example.com/api?existing=123';
    const params = {
      param1: 'value1',
      param2: 'value2',
    };

    const expectedURL = `${url}&param1=value1&param2=value2`;
    const result = processURL(url, { param: params });

    expect(result).toBe(expectedURL);
  });
});
