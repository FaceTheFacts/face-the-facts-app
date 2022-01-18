export async function fetch_api<T>(url: string): Promise<T | undefined> {
  const BASE_URL = 'https://api.facethefacts-api.de/v1';
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
