import processData from '.';

describe('processData', () => {
  it('should stringify data if it is JSON content', () => {
    const option = {
      data: { name: 'ei', age: 17 },
      header: { 'content-type': 'application/json' },
    };

    const result = processData(option);
    const expected = JSON.stringify(option.data);

    expect(result).toEqual(expected);
  });

  it('should return data as is if it is not JSON content', () => {
    const option = {
      data: 'Hello, World!',
      header: { 'content-type': 'text/plain' },
    };

    const result = processData(option);

    expect(result).toEqual(option.data);
  });

  it('should return data as is if content-type is not provided', () => {
    const option = {
      data: { name: 'ei', age: 17 },
      header: {},
    };

    const result = processData(option);

    expect(result).toEqual(option.data);
  });

  it('should return data as is if it is not an object', () => {
    const option = {
      data: 'Hello, World!',
      header: { 'content-type': 'application/json' },
    };

    const result = processData(option);

    expect(result).toEqual(option.data);
  });
});
