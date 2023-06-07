import processError from '.';

describe('processError', () => {
  const mockOption = {};

  it('should throw enriched error if error is an object and is aborted', () => {
    const mockError = { type: 'aborted' };
    const expectedEnrichedError = {
      ...mockError,
      option: mockOption,
      status: 408,
      message: 'Timeout',
      name: 'TimeoutError',
    };

    expect(() => processError(mockOption)(mockError)).toThrowError(
      expectedEnrichedError,
    );
  });

  it('should throw error as is if error is not an object', () => {
    const mockError = 'Some error';

    expect(() => processError(mockOption)(mockError)).toThrowError(mockError);
  });

  it('should throw error as is if error is undefined', () => {
    const mockError = undefined;

    expect(() => processError(mockOption)(mockError)).toThrowError(mockError);
  });
});
