import { DATA } from '../src/data';

describe('data', () => {
  test('It should stringify JSON data when contentType is "application/json"', () => {
    const { processData } = DATA;
    const data = { key: 'value' };
    const contentType = 'application/json; charset=utf-8';
    const processedData = processData({ data, contentType });

    expect(processedData).toEqual(JSON.stringify(data));
  });

  test('It should not stringify non-JSON data', () => {
    const { processData } = DATA;
    const data = 'plain text data';
    const contentType = 'text/plain';
    const processedData = processData({ data, contentType });
    expect(processedData).toEqual(data);
  });

  test('It should not modify data when contentType is undefined', () => {
    const { processData } = DATA;
    const data = { key: 'value' };
    const contentType = undefined;
    const processedData = processData({ data, contentType });

    expect(processedData).toEqual(data);
  });
});
