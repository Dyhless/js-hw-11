import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query) {
   try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`);
      if (!response.ok) {
         throw new Error('Error with status' + response.status);
      }

      const picturesCards = await response.json();

      const images = picturesCards.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => ({
         webformatURL,
         largeImageURL,
         tags,
         likes,
         views,
         comments,
         downloads
      }));
      return images;
   } catch (error) {
      console.error('Ошибка:', error);
      Notiflix.Notify.failure('Failed to upload images. Please try again later');
      throw error; // rethrow the error to be caught in the `onError` function
   }
}

export default { getPictures };
