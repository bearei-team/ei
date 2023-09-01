import { PROCESS_DATA } from '../src/data';

describe('PROCESS_DATA', () => {
  test('It should stringify JSON data when contentType is "application/json"', () => {
    const data = { key: 'value' };
    const contentType = 'application/json; charset=utf-8';
    const processedData = PROCESS_DATA({ data, contentType });

    expect(processedData).toEqual(JSON.stringify(data));
  });

  test('It should not stringify non-JSON data', () => {
    const data = 'plain text data';
    const contentType = 'text/plain';
    const processedData = PROCESS_DATA({ data, contentType });

    expect(processedData).toEqual(data);
  });

  test('It should not modify data when contentType is undefined', () => {
    const data = { key: 'value' };
    const contentType = undefined;
    const processedData = PROCESS_DATA({ data, contentType });

    expect(processedData).toEqual(data);
  });
});
