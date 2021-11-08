export async function fetch_data(url: string) {
    const BASE_URL = 'http://127.0.0.1:8000/';
    try {
	const response = await fetch(BASE_URL + url);
    const json = await response.json()
	return json;
    } catch(error) {
        console.error(error);
    }
}