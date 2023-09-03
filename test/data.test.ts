import { DATA } from '../src/data';

describe('data', () => {
  test('It should stringify JSON data when contentType is "application/json"', () => {
    const { processData } = DATA;
    const data = { key: 'value' };
    const processedData = processData(data);

    expect(processedData).toEqual(JSON.stringify(data));
  });

  test('It should not stringify non-JSON data', () => {
    const { processData } = DATA;
    const data = 'plain text data';
    const processedData = processData(data);

    expect(processedData).toEqual(data);
  });

  test('It should not modify data when contentType is undefined', () => {
    const { processData } = DATA;
    const data = { key: 'value' };
    const processedData = processData(data);

    expect(processedData).toEqual(JSON.stringify(data));
  });
});
