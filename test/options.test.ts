import * as options from '../src/options';

describe('options', () => {
  beforeEach(() => {
    options.set({});
  });

  afterEach(() => {
    options.set({});
  });

  it('should set and get options value', () => {
    const key = 'baseUrl';
    const value = 'www.bear_ei_api.com';

    options.set({ [key]: value });

    const retrievedValue = options.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should clear options values', () => {
    const key = 'baseUrl';
    const value = 'www.bear_ei_api.com';

    options.set({ [key]: value });
    options.set({});

    const retrievedValue = options.get(key);

    expect(retrievedValue).toBeUndefined();
  });
});
