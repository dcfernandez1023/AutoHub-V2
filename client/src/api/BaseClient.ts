class BaseClient {
  protected _defaultOptions: RequestInit = { credentials: 'include' };
  protected _defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
}

export default BaseClient;
