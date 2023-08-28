import type { FetchOptions } from '@/core';
import * as globalOption from './options';

export type URLOptions = Partial<Pick<FetchOptions, 'param' | 'isEncode'>>;

const processFullURL = (url: string): URL => {
  if (!RegExp(/^(http|https):\/\//).exec(url)) {
    url = `${globalOption.get('baseUrl')}${url}`;
  }

  return new URL(url);
};

const getQueryParam = (
  searchParam: URLSearchParams,
): Record<string, string | null> =>
  Array.from(searchParam.keys()).reduce<Record<string, string | null>>(
    (query, key) => ({ ...query, [key]: searchParam.get(key) }),
    {},
  );

export const processURL = (
  url: string,
  { param = {}, isEncode = true }: URLOptions = {},
): string => {
  const { searchParams, origin, pathname } = processFullURL(url);
  const newURL = `${origin}${pathname !== '/' ? pathname : ''}`;
  const queryParam = getQueryParam(searchParams);
  const query = { ...queryParam, ...param };
  const queryString = Object.entries(query).reduce(
    (accumulator, [key, value]) => {
      if (value || typeof value === 'number') {
        const encodedValue = isEncode ? encodeURIComponent(value) : value;

        return accumulator
          ? `${accumulator}&${key}=${encodedValue}`
          : `${key}=${encodedValue}`;
      }

      return accumulator;
    },
    '',
  );

  return queryString ? `${newURL}?${queryString}` : newURL;
};
