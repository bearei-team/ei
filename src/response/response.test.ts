import processResponse from '.';

describe('processResponse', () => {
  it('should process response with successful status', async () => {
    const option = {};
    const response = new Response('{"message": "Success"}', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    });

    const result = await processResponse(option)(response);

    expect(result).toEqual({
      status: 200,
      statusText: 'OK',
      header: { 'content-type': 'application/json' },
      url: '',
      option: {},
      data: { message: 'Success' },
    });
  });

  it('should process response with error status', async () => {
    const option = {};
    const response = new Response('{"error": "Not Found"}', {
      status: 404,
      statusText: 'Not Found',
      headers: { 'content-type': 'application/json' },
    });

    await expect(processResponse(option)(response)).rejects.toEqual({
      status: 404,
      statusText: 'Not Found',
      header: { 'content-type': 'application/json' },
      url: '',
      option: {},
      data: { error: 'Not Found' },
      name: 'HTTPError',
    });
  });

  it('should process response with JSON content-type', async () => {
    const option = {};
    const response = new Response('{"message": "Success"}', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    });

    const result = await processResponse(option)(response);

    expect(result.data).toEqual({ message: 'Success' });
  });

  it('should process response with text content-type', async () => {
    const option = {};
    const response = new Response('Hello, World!', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain' },
    });

    const result = await processResponse(option)(response);

    expect(result.data).toEqual('Hello, World!');
  });

  it('should process response with octet-stream content-type', async () => {
    const option = {};
    const response = new Response('{"data": "Binary data"}', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/octet-stream' },
    });

    const result = await processResponse(option)(response);

    expect(result.data).toEqual({ data: 'Binary data' });
  });

  it('should process response with application/vnd.ms-excel content-type', async () => {
    const option = {};
    const response = new Response('{"data": "Binary data"}', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/vnd.ms-excel' },
    });

    const result = await processResponse(option)(response);

    expect(result.data).toBeInstanceOf(Blob);
  });

  it('should process response with custom content-type', async () => {
    const option = {};
    const response = new Response('<html><body><h1>Hello</h1></body></html>', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/html' },
    });

    const result = await processResponse(option)(response);

    expect(result.data).toEqual('<html><body><h1>Hello</h1></body></html>');
  });
});
