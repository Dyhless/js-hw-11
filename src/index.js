import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

let currentPage = 1;
let lightbox;

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  const { searchQuery } = refs.form.elements;
  const value = searchQuery.value.trim();

  if (value === '') {
    console.error('Nothing to search');
    return Notiflix.Notify.info('Please enter something in the search field');
  }

  currentPage = 1; 
  fetchImages(value, currentPage);
}

function fetchImages(query, page) {
  API.getPictures(query, page)
    .then(({ images, totalHits }) => {
      if (images.length === 0) {
        throw new Error('No data');
      }

      const markup = images.reduce((acc, card) => acc + createMarkup(card), '');
      updateImageList(markup);

      updateLoadMoreBtn(images.length < totalHits);

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    })
    .catch(onError);
}

function onError(error) {
  console.error(error);
  Notiflix.Notify.info('Sorry, there are no images matching your search query');
}

function updateImageList(markup) {
  refs.imageGallery.innerHTML = markup;
  initializeLightbox();
}

function initializeLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.photo-card a', {
      errorText: false, 
    });
  }
}

function updateLoadMoreBtn(hasMoreImages) {
  if (hasMoreImages) {
    refs.loadMoreBtn.classList.remove('hidden');
  } else {
    refs.loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
