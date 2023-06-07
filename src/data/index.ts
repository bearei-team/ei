import type { ProcessDataOption } from './data';

const isJSONContent = (data: unknown, contentType?: string) =>
  typeof data === 'object' &&
  data !== null &&
  contentType?.startsWith('application/json');

const processData = ({ data, header }: ProcessDataOption) =>
  isJSONContent(data, header['content-type']) ? JSON.stringify(data) : data;

export default processData;
