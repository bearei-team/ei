import { processError } from '../src/error';

describe('processError', () => {
  const mockOptions = {};

  it('should throw enriched error if error is an object and is aborted', () => {
    const mockError = { type: 'aborted' };
    const expectedEnrichedError = {
      ...mockError,
      options: mockOptions,
      status: 408,
      message: 'Timeout',
      name: 'TimeoutError',
    };

    expect(() => processError(mockOptions)(mockError)).toThrowError(
      expectedEnrichedError,
    );
  });

  it('should throw error as is if error is not an object', () => {
    const mockError = 'Some error';

    expect(() => processError(mockOptions)(mockError)).toThrowError(mockError);
  });

  it('should throw error as is if error is undefined', () => {
    const mockError = undefined;

    expect(() => processError(mockOptions)(mockError)).toThrowError(mockError);
  });
});
