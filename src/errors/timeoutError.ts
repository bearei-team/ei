export class TimeoutError extends Error {
  readonly request: Request;

  constructor(request: Request) {
    super('Request timed out');
    this.name = 'TimeoutError';
    this.request = request;
  }
}
