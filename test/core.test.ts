import 'jest-fetch-mock';
import { EI } from '../src/core';
import { Err } from '../src/error';

describe('core', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('It should be successful in obtaining EI data', async () => {
    const responseData = { key: 'value' };

    fetchMock.mockResponseOnce(JSON.stringify({ key: 'value' }), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    const result = await EI('https://example.com', { method: 'GET' });

    expect(result.data).toEqual(responseData);
    expect(result.status).toEqual(200);
  });

  test('It should be a failure in obtaining EI data', async () => {
    fetchMock.mockResponseOnce('Precondition Failed', {
      status: 412,
      statusText: 'Precondition Failed',
    });

    const result = await EI('https://example.com', {
      method: 'GET',
    }).catch((err: Err) => err);

    expect(result.data).toEqual('Precondition Failed');
    expect(result.status).toEqual(412);
  });

  test('It should be a timeout in obtaining EI data', async () => {
    fetchMock.mockAbort();

    const result = await EI('https://example.com', {
      method: 'GET',
    }).catch((err: Err) => err);

    expect(result.data).toEqual('Request Timeout');
    expect(result.status).toEqual(408);
  });
});
