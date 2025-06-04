export type FetchClientOptions = RequestInit;

export interface FetchClient {
  baseUrl: string;
  options: FetchClientOptions;
  get<T>(pathname: string, options?: Omit<FetchClientOptions, 'method'>): Promise<T>;
  post<T>(pathname: string, options?: Omit<FetchClientOptions, 'method'>): Promise<T>;
  put<T>(pathname: string, options?: Omit<FetchClientOptions, 'method'>): Promise<T>;
  patch<T>(pathname: string, options?: Omit<FetchClientOptions, 'method'>): Promise<T>;
  delete<T>(pathname: string, options?: Omit<FetchClientOptions, 'method'>): Promise<T>;
}
