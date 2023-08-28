import { processData } from '../src/data';

describe('processData', () => {
  it('should stringify data if it is JSON content', () => {
    const options = {
      data: { name: 'ei', age: 17 },
      headers: { 'content-type': 'application/json' },
    };

    const result = processData(options);
    const expected = JSON.stringify(options.data);

    expect(result).toEqual(expected);
  });

  it('should return data as is if it is not JSON content', () => {
    const options = {
      data: 'Hello, World!',
      headers: { 'content-type': 'text/plain' },
    };

    const result = processData(options);

    expect(result).toEqual(options.data);
  });

  it('should return data as is if content-type is not provided', () => {
    const options = {
      data: { name: 'ei', age: 17 },
      headers: {},
    };

    const result = processData(options);

    expect(result).toEqual(options.data);
  });

  it('should return data as is if it is not an object', () => {
    const options = {
      data: 'Hello, World!',
      headers: { 'content-type': 'application/json' },
    };

    const result = processData(options);

    expect(result).toEqual(options.data);
  });
});
