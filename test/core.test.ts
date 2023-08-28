import fetch from 'jest-fetch-mock';
import { ei } from '../src/core';

describe('core', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });

  afterAll(() => {
    fetch.disableMocks();
  });

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('performs a GET request with default options', async () => {
    const url = 'https://api.example.com/data';

    fetch.mockResponseOnce(JSON.stringify({ message: 'Success' }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await ei(url);

    expect(result.status).toEqual(200);
    expect(result.data).toEqual({ message: 'Success' });
  });

  it('performs a POST request with custom options', async () => {
    const url = 'https://api.example.com/data';
    const request = { name: 'John Doe', email: 'john@example.com' };
    const headers = { 'Content-Type': 'application/json' };

    fetch.mockResponseOnce(JSON.stringify({ message: 'Created' }), {
      status: 201,
      headers,
    });

    const result = await ei(url, {
      method: 'POST',
      headers,
      data: request,
      timeout: 2000,
    });

    expect(result.status).toEqual(201);
    expect(result.data).toEqual({ message: 'Created' });
  });

  it('handles a failed request and returns an error', async () => {
    const url = 'https://api.example.com/data';

    fetch.mockResponseOnce(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await ei(url).catch(err => err);

    expect(result.status).toEqual(500);
    expect(result.statusText).toEqual('Internal Server Error');
  });

  it('handles a request timeout and returns an error', async () => {
    const url = 'https://api.example.com/data';
    const timeout = 100;

    fetch.mockResponseOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () => resolve({ body: JSON.stringify({ message: 'Success' }) }),
            2000,
          ),
        ),
    );

    const result = await ei(url, { timeout }).catch(err => err);

    expect(result.status).toEqual(408);
    expect(result.statusText).toEqual('Timeout');
  });
});
