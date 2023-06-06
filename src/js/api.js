import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query) {
   try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`);
      if (!response.ok) {
         throw new Error('Error with status' + response.status);
      }
      const result = await response.json();
      return result;
   } catch (error) {
      console.error('Ошибка:', error);
      Notiflix.Notify.failure('Failed to upload images. Please try again later');
      throw error; // rethrow the error to be caught in the `onError` function
   }
}

export default { getPictures };
