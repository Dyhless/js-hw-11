import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query, page = 1, perPage = 40) {
   try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
      if (!response.ok) {
         throw new Error('Error with status' + response.status);
      }

      const data = await response.json();

      if (!Array.isArray(data.hits)) {
         throw new Error('Invalid data format');
      }

      const images = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => ({
         webformatURL,
         largeImageURL,
         tags,
         likes,
         views,
         comments,
         downloads
      }));
      return {
         images,
         totalHits: data.totalHits
      };
   } catch (error) {
      console.error('Error:', error);
      Notiflix.Notify.failure('Failed to fetch images. Please try again later');
   }
}


export default { getPictures };
