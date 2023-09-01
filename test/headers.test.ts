import { PROCESS_HEADERS } from '../src/headers';

describe('PROCESS_HEADERS', () => {
  test('It should merge default headers and global headers', () => {
    const defaultHeaders = {
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
    };

    const result = PROCESS_HEADERS();
    expect(result).toEqual(expect.objectContaining(defaultHeaders));
  });

  test('It should merge default headers and new headers', () => {
    const newHeaders = {
      'content-type': 'application/xml',
      'custom-header': 'custom-value',
      accept: '*/*',
    };

    const headers = new Headers(newHeaders);
    const result = PROCESS_HEADERS(headers);

    expect(result).toEqual(expect.objectContaining(newHeaders));
  });

  test('It should remove "content-type" header if starts with "multipart/form-data"', () => {
    const headers: [string, string][] = [
      [
        'content-type',
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      ],
    ];

    const result = PROCESS_HEADERS(headers);

    expect(result).not.toHaveProperty('content-type');
  });
});
