import processData from '../data';
import processError from '../error';
import processHeader from '../header';
import * as globalOption from '../option';
import processResponse from '../response';
import processURL from '../url';
import type { FetchOption } from './core.interface';

const createRequest = () => {
  const createRequestOption = (
    url: string,
    {
      url: requestURL,
      method = 'GET',
      param,
      timeout,
      headers,
      data,
      isEncode,
      ...rest
    }: FetchOption = {},
  ) => {
    const processedHeader = processHeader(headers);
    const processedData = processData({ data, header: processedHeader });
    const processedURL = processURL(url ?? requestURL, { param, isEncode });
    const requestTimeout = (timeout ??
      globalOption.get('timeout') ??
      3000) as number;

    return {
      method,
      headers: processedHeader,
      body: processedData,
      url: processedURL,
      timeout: requestTimeout,
      ...rest,
    };
  };

  const performRequest = (option: FetchOption) => {
    const abort = new AbortController();
    const signal = abort.signal;
    const timer = setTimeout(() => abort.abort(), option.timeout);
    const performProcessResponse = processResponse(option);
    const performProcessError = processError(option);
    const processFinally = () => {
      timer.unref?.();
      clearTimeout(timer);
    };

    return fetch(option.url!, { signal, ...option })
      .then(performProcessResponse)
      .catch(performProcessError)
      .finally(processFinally);
  };

  const request = (url: string, option: FetchOption = {}) => {
    const requestOption = createRequestOption(url, option);

    return performRequest(requestOption);
  };

  request.option = globalOption;

  return request;
};

const ei = createRequest();

export default ei;
