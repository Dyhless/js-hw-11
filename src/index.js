import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

let currentPage = 1;
let lightbox;
let currentQuery = '';

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

  currentQuery = value;
  currentPage = 1;
  fetchImages();
}

function fetchImages() {
  API.getPictures(currentQuery, currentPage)
    .then(handleImagesResponse)
    .catch(onError);
}

function handleImagesResponse({ images, totalHits }) {
  if (images.length === 0) {
    throw new Error('No data');
  }

  const markup = images.reduce((acc, card) => acc + createMarkup(card), '');
  updateImageList(markup);

  const hasMoreImages = images.length < totalHits;
  updateLoadMoreBtn(hasMoreImages);

  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function onError(error) {
  console.error(error);
  Notiflix.Notify.info('Sorry, there are no images matching your search query');
}

function updateImageList(markup) {
  refs.imageGallery.insertAdjacentHTML('beforeend', markup);
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
  refs.loadMoreBtn.classList.toggle('hidden', !hasMoreImages);

  if (!hasMoreImages) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function onLoadMore() {
  currentPage += 1;
  fetchImages();
}
