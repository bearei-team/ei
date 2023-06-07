import type { FetchOption } from '../core/core.interface';

export type Option = Pick<FetchOption, 'headers' | 'timeout' | 'baseURL'>;
