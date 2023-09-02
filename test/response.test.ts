import { RESPONSE } from '../src/response';

const { createProcessResponse } = RESPONSE;

describe('response', () => {
  test('It should create a successful FetchResponse', async () => {
    const request = new Request('https://example.com/api');
    const response = new Response('{"data": "example"}', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const createResponse = createProcessResponse({ request });
    const result = await createResponse(response);

    expect(result.status).toBe(200);
    expect(result.statusText).toBe('OK');
    expect(result.data).toEqual({ data: 'example' });
  });

  test('It should reject with ResponseError on non-OK response', async () => {
    const request = new Request('https://example.com/api');
    const response = new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });

    const createResponse = createProcessResponse({ request });
    await expect(createResponse(response)).rejects.toThrowError(
      'Request response failed',
    );
  });
});
