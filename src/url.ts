import type { FetchOptions, SearchType } from '@/core';
import { OPTIONS_STORE } from './optionsStore';

export type ProcessURLOptions = Partial<
  Pick<FetchOptions, 'param' | 'isEncode'>
>;
export interface CreatedURL {
  processURL: typeof processURL;
}

const optionsStore = OPTIONS_STORE;
const processFullURL = (url: string): URL => {
  if (!RegExp(/^(http|https):\/\//).exec(url)) {
    url = `${optionsStore.get('baseURL')}${url}`;
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
  { isEncode = true }: Pick<ProcessURLOptions, 'isEncode'>,
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

const processURL = (
  url: string,
  { param = {}, isEncode }: ProcessURLOptions = {},
): string => {
  const { searchParams, origin, pathname } = processFullURL(url);
  const newURL = `${origin}${pathname !== '/' ? pathname : ''}`;
  const searchParam = { ...getSearchParam(searchParams), ...param };
  const searchString = processSearchString(searchParam, { isEncode });

  return searchString ? `${newURL}?${searchString}` : newURL;
};

const createResponse = (): CreatedURL => ({
  processURL,
});

export const CREATED_URL = createResponse();
