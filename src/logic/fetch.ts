export async function fetch_data(url: string) {
    const BASE_URL = 'https://api.facethefacts-api.de/';
    try {
	const response = await fetch(BASE_URL + url);
    const json = await response.json()
    console.log(url)
	return json;
    } catch(error) {
        console.error(error);
    }
}