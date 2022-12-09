import { AxiosRequestConfig } from 'axios';

export function getRequestBase(url: string, token: string, method: string, data?: string): AxiosRequestConfig {
  const requestBase: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    url,
    method,
    data,
  };
  return requestBase;
}
