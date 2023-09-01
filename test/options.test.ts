import { clear, get, set } from '../src/options';

describe('Options Storage', () => {
  afterEach(() => {
    clear();
  });

  test('It should set and get a value', () => {
    set('headers', { 'Content-Type': 'application/json' });

    const headers = get('headers');

    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  test('It should return undefined for a key that was not set', () => {
    const timeout = get('timeout');

    expect(timeout).toBeUndefined();
  });

  test('It should clear all options', () => {
    set('headers', { 'Content-Type': 'application/json' });
    set('timeout', 5000);
    clear();

    const headers = get('headers');
    const timeout = get('timeout');

    expect(headers).toBeUndefined();
    expect(timeout).toBeUndefined();
  });

  test('It should handle setting and getting baseURL', () => {
    set('baseURL', 'https://example.com/api');

    const baseURL = get('baseURL');

    expect(baseURL).toBe('https://example.com/api');
  });
});
