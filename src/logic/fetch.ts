import {fetch} from 'react-native-ssl-pinning';

const env = require('../../env.json');
if (!env.BASE_URL) {
  console.error('BASE_URL in env.json is missing');
}

export async function fetch_api<T>(url: string): Promise<T | undefined> {
  const BASE_URL = env.BASE_URL;
  try {
    const response = await fetch(`${BASE_URL}/${url}`, {
      method: 'GET',
      timeoutInterval: 10000,
      sslPinning: {
        certs: ['ftf-cert'],
      },
    });

    if (response.status >= 200 && response.status <= 299) {
      const jsonResponse = await response.json();
      return jsonResponse as T;
    }
  } catch (error: Error | any) {
    throw new Error(error);
  }
}
