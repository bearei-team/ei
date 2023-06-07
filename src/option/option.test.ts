<<<<<<< HEAD
import * as option from '.';
=======
import { option } from '.';
>>>>>>> main

describe('option', () => {
  beforeEach(() => {
    option.set({});
  });

  afterEach(() => {
    option.set({});
  });

  it('should set and get option value', () => {
    const key = 'baseURL';
    const value = 'www.bear_ei_api.com';

    option.set({ [key]: value });

    const retrievedValue = option.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should clear option values', () => {
    const key = 'baseURL';
    const value = 'www.bear_ei_api.com';

    option.set({ [key]: value });
    option.set({});

    const retrievedValue = option.get(key);

    expect(retrievedValue).toBeUndefined();
  });

  it('should return undefined for non-existing key', () => {
    const retrievedValue = option.get('nonExistingKey');

    expect(retrievedValue).toBeUndefined();
  });
});
