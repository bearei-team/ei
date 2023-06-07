<<<<<<< HEAD
import * as globalOption from '../option';
=======
import { option as globalOption } from '../option';
>>>>>>> main
import type { URLOption } from './url';

const processFullURL = (url: string) => {
  if (!RegExp(/^(http|https):\/\//).exec(url)) {
    url = `${globalOption.get('baseURL')}${url}`;
  }

  return new URL(url);
};

const getQueryParam = (searchParam: URLSearchParams) =>
  Array.from(searchParam.keys()).reduce<Record<string, string | null>>(
    (query, key) => ({ ...query, [key]: searchParam.get(key) }),
    {},
  );

const processURL = (
  url: string,
  { param = {}, isEncode = true }: URLOption = {},
) => {
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

export default processURL;
