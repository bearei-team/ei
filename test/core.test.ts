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
      url: 'https://example.com',
    };

    const fetchResult = await EI(options.url!, options);

    expect(fetchResult.data).toEqual(responseData);
    expect(fetchResult.status).toEqual(200);
  });

  test('It should be a failure in obtaining EI data', async () => {
    fetchMock.mockResponseOnce('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });

    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    const fetchResult = await EI(options.url!, options).catch(
      (err: Err) => err,
    );

    expect(fetchResult.data).toEqual('Not Found');
    expect(fetchResult.status).toEqual(404);
  });

  test('It should be a timeout in obtaining EI data', async () => {
    fetchMock.mockAbort();

    const options: FetchOptions = {
      method: 'GET',
      url: 'https://example.com',
    };

    const fetchResult = await EI(options.url!, options).catch(
      (err: Err) => err,
    );

    expect(fetchResult.data).toEqual('Request Timeout');
    expect(fetchResult.status).toEqual(408);
  });
});
