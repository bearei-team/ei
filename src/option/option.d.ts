import type { FetchOption } from '../core/ei';

export type Option = Pick<FetchOption, 'headers' | 'timeout' | 'baseURL'>;
