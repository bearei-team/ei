import { HEADERS } from '../src/headers';

describe('headers', () => {
  test('It should convert the headers array to an object', () => {
    const { extractHeaders } = HEADERS;
    const headersArray: [string, string][] = [
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer token'],
    ];

    const headersObject = extractHeaders(headersArray);

    expect(headersObject).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });
  });

  test('It should merge default headers and global headers', () => {
    const { processHeaders } = HEADERS;
    const defaultHeaders = {
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
    };

    const result = processHeaders();
    expect(result).toEqual(expect.objectContaining(defaultHeaders));
  });

  test('It should merge default headers and new headers', () => {
    const { processHeaders } = HEADERS;
    const newHeaders = {
      'content-type': 'application/xml',
      'custom-header': 'custom-value',
      accept: '*/*',
    };

    const headers = new Headers(newHeaders);
    const result = processHeaders(headers);

    expect(result).toEqual(expect.objectContaining(newHeaders));
  });

  test('It should remove "content-type" header if starts with "multipart/form-data"', () => {
    const { processHeaders } = HEADERS;
    const headers: [string, string][] = [
      [
        'content-type',
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      ],
    ];

    const result = processHeaders(headers);
    expect(result).not.toHaveProperty('content-type');
  });
});
