import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query, page = 1, perPage = 40) {
   try {
      const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
      const response = await fetch(url);

      if (!response.ok) {
         throw new Error('Error with status ' + response.status);
      }

      const data = await response.json();

      if (!Array.isArray(data.hits)) {
         throw new Error('Invalid data format');
      }

      const images = data.hits.map(formatImageData);
      const totalHits = data.totalHits;

      return {
         images,
         totalHits
      };
   } catch (error) {
      console.error('Error:', error);
      Notiflix.Notify.failure('Failed to fetch images. Please try again later');
      throw error;
   }
}

function formatImageData({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
   return {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads
   };
}



export { getPictures, formatImageData };
