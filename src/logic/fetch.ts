const env = require('../../env.json');
if (!env.BASE_URL) {
  console.error('BASE_URL in env.json is missing');
}

export async function fetch_api<T>(url: string): Promise<T | undefined> {
  const BASE_URL = env.BASE_URL;
  try {
    const response = await fetch(`${BASE_URL}/${url}`);
    if (response.status >= 200 && response.status <= 299) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function request<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url);
    if (response.status >= 200 && response.status <= 299) {
      return await response.json();
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
}
