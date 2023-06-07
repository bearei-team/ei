import processHeader from '.';
import { option } from '../option';

describe('processHeader', () => {
  beforeEach(() => {
    jest.spyOn(option, 'get').mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return merged and modified header', () => {
    const optionHeader = {
      'content-type': 'application/xml',
      'x-custom-header': 'custom-value',
    };

    const customHeader = {
      'content-type': 'text/plain',
      'x-another-header': 'another-value',
    };

    const expectedMergedHeader = {
      'content-type': 'text/plain',
      accept: '*/*',
      'x-custom-header': 'custom-value',
      'x-another-header': 'another-value',
    };

    jest.spyOn(option, 'get').mockReturnValue(optionHeader);

    const processedHeader = processHeader(customHeader);

    expect(processedHeader).toEqual(expectedMergedHeader);
  });

  it('should remove content-type if it starts with "multipart/form-data"', () => {
    const customHeader = {
      'content-type':
        'multipart/form-data; boundary=----WebKitFormBoundaryABC123',
      'x-custom-header': 'custom-value',
    };

    const expectedModifiedHeader = {
      accept: '*/*',
      'x-custom-header': 'custom-value',
    };

    const processedHeader = processHeader(customHeader);

    expect(processedHeader).toEqual(expectedModifiedHeader);
  });

  it('should return default header if options is not provided', () => {
    const expectedDefaultHeader = {
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
    };

    const processedHeader = processHeader();

    expect(processedHeader).toEqual(expectedDefaultHeader);
  });

  it('should return default header if options is an empty object', () => {
    const expectedDefaultHeader = {
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
    };

    const processedHeader = processHeader({});

    expect(processedHeader).toEqual(expectedDefaultHeader);
  });

  it('should merge config headers and default headers', () => {
    jest.spyOn(option, 'get').mockReturnValue([['x-api-key', '123456']]);

    const expectedHeader = {
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
      'x-api-key': '123456',
    };

    expect(processHeader()).toEqual(expectedHeader);
  });
});
