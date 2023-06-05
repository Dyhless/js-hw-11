export const BASE_URL = 'https://pixabay.com/api/';
export const API_KEY = '37053026-4150c05ae3a340932daa6308e';

export function getPictures(query) {
   fetch('${BASE_URL}?apiKey=${API_KEY}&q=${query}')
} 

getPictures("gpt-3");