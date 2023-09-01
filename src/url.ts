import type { FetchOptions, SearchType } from '@/core';
import * as globalOption from './options';

export type URLOptions = Partial<Pick<FetchOptions, 'param' | 'isEncode'>>;

const processFullURL = (url: string): URL => {
  if (!RegExp(/^(http|https):\/\//).exec(url)) {
    url = `${globalOption.get('baseURL')}${url}`;
  }

  return new URL(url);
};

const getSearchParam = (
  searchParam: URLSearchParams,
): Record<string, string | null> =>
  Array.from(searchParam.keys()).reduce<Record<string, string | null>>(
    (search, key) => ({ ...search, [key]: searchParam.get(key) }),
    {},
  );

const processSearchString = (
  searchParam: Record<string, SearchType | null>,
  { isEncode = true }: Pick<URLOptions, 'isEncode'>,
) =>
  Object.entries(searchParam).reduce((accumulator, [key, value]) => {
    if (value || typeof value === 'number') {
      const encodedValue = isEncode ? encodeURIComponent(value) : value;

      return accumulator
        ? `${accumulator}&${key}=${encodedValue}`
        : `${key}=${encodedValue}`;
    }

    return accumulator;
  }, '');

export const PROCESS_URL = (
  url: string,
  { param = {}, isEncode }: URLOptions = {},
): string => {
  const { searchParams, origin, pathname } = processFullURL(url);
  const newURL = `${origin}${pathname !== '/' ? pathname : ''}`;
  const searchParam = { ...getSearchParam(searchParams), ...param };
  const searchString = processSearchString(searchParam, { isEncode });

  return searchString ? `${newURL}?${searchString}` : newURL;
};
