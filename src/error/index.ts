import type { ProcessErrorOption } from './error.interface';

const isAborted = (error: Record<string, unknown>) =>
  (error.type as string)?.toLowerCase() === 'aborted' ||
  (error.message as string)
    ?.toLowerCase()
    .startsWith('the operation was aborted');

const enrichError = (
  error: Record<string, unknown>,
  option: ProcessErrorOption,
) => ({
  ...error,
  option,
  ...(isAborted(error)
    ? {
        status: 408,
        statusText: 'Timeout',
        message: 'Timeout',
        name: 'TimeoutError',
      }
    : {}),
});

const processError = (option: ProcessErrorOption) => (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    throw enrichError(error as Record<string, unknown>, option);
  }

  throw error;
};

export default processError;
