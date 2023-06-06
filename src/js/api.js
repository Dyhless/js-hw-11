const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query) {
   try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}`);
      if (!response.ok) {
         throw new Error('Request failed with status ' + response.status);
      }
      const result = await response.json();
      return console.log(result);
   } catch (error) {
      console.error('Error:', error);
   }
} 

export default { getPictures };