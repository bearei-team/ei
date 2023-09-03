import 'jest-fetch-mock';
import { EI, FetchOptions } from '../src/core';
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

    const options: FetchOptions = {
      method: 'GET',
    };

    const fetchResult = await EI('https://example.com', options);

    expect(fetchResult.data).toEqual(responseData);
    expect(fetchResult.status).toEqual(200);
  });

  test('It should be a failure in obtaining EI data', async () => {
    fetchMock.mockResponseOnce('Precondition Failed', {
      status: 412,
      statusText: 'Precondition Failed',
    });

    const options: FetchOptions = {
      method: 'GET',
    };

    const fetchResult = await EI('https://example.com', options).catch(
      (err: Err) => err,
    );

    expect(fetchResult.data).toEqual('Precondition Failed');
    expect(fetchResult.status).toEqual(412);
  });

  test('It should be a timeout in obtaining EI data', async () => {
    fetchMock.mockAbort();

    const options: FetchOptions = {
      method: 'GET',
    };

    const fetchResult = await EI('https://example.com', options).catch(
      (err: Err) => err,
    );

    expect(fetchResult.data).toEqual('Request Timeout');
    expect(fetchResult.status).toEqual(408);
  });
});
