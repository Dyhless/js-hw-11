const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query) {
   const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}`);
   const result = await response.json();
   return console.log(result);
} 

export default { getPictures };