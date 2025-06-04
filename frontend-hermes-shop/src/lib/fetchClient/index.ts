import { core } from './core';
import { FetchClient, FetchClientOptions } from './types';

/*
  const apiClient = fetchClient({
    baseUrl: "base"
    request: {
      then: (request: Request) => {},
      catch: (error: Error) => {},
    },
    response: {
      then: (request: Request) => {},
      catch: (error: Error) => {},
    }
  })
  
  apiClient.params.get("v1/products").json();
  apiClient.data({name: "product"}).post("v1/products").json();
*/
export function fetchClient(baseUrl: string, options: FetchClientOptions = {}): FetchClient {
  return { ...core, baseUrl, options };
}
