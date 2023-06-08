import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37053026-4150c05ae3a340932daa6308e';

async function getPictures(query, page = 1, perPage = 40) {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    const response = await axios.get(url);

    if (!response.data.hits || !Array.isArray(response.data.hits)) {
      throw new Error('Invalid data format');
    }

    const images = response.data.hits.map(formatImageData);
    const totalHits = response.data.totalHits;

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

// const openImage = async (imageURL) => {
//   window.open(imageURL, '_blank');
// };

// const createImageCard = (image) => {
//   const card = document.createElement('div');
//   card.classList.add('card');

//   const imageElement = document.createElement('img');
//   imageElement.src = image.webformatURL;
//   imageElement.alt = image.tags;

//   imageElement.addEventListener('click', () => {
//     openImage(image.largeImageURL);
//   });

//   card.appendChild(imageElement);
//   return card;
// };

// export { createImageCard, openImage };

export default { getPictures, formatImageData };
