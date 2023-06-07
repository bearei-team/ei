import type {
  ContentType,
  ProcessResponseDataOption,
  ProcessResponseOption,
} from './response.interface';

const parseFunctionMap: Record<
  ContentType,
  (response: Response) => Promise<unknown>
> = {
  json: (response: Response) => response.json(),
  text: (response: Response) => response.text(),
  file: (response: Response) => response.blob(),
  octetStream: async (response: Response) => {
    const body = await response.text();

    try {
      return JSON.parse(body);
    } catch (error) {
      return body;
    }
  },
};

const contentTypeMap: Record<string, ContentType> = {
  'application/json': 'json',
  'application/octet-stream': 'octetStream',
  'text/html': 'text',
  'text/plain': 'text',
  'application/vnd.ms-excel': 'file',
};

const processResponseData = async (
  response: Response,
  type: ContentType,
  option: ProcessResponseDataOption,
) => {
  const data = await parseFunctionMap[type](response);
  const result = { ...option, data };

  return response.ok
    ? result
    : Promise.reject({ ...result, name: 'HTTPError' });
};

const extractHeader = (response: Response) =>
  [...response.headers.entries()].reduce(
    (accumulator, [key, value]) => ({ ...accumulator, [key]: value }),
    {},
  );

const getContentType = (contentType?: string) => {
  const contentTypeKey = Object.keys(contentTypeMap).find(key =>
    contentType?.startsWith(key),
  );

  return contentTypeKey ? contentTypeMap[contentTypeKey] : 'text';
};

const processResponse =
  (option: ProcessResponseOption) => async (response: Response) => {
    const { status, statusText, url } = response;
    const header = extractHeader(response) as Record<string, string>;
    const contentType = header['content-type'];
    const type = getContentType(contentType);

    return processResponseData(response, type, {
      status,
      statusText,
      header,
      url,
      option,
    });
  };

export default processResponse;
