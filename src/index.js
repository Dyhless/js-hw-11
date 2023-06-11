import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

let currentPage = 1;
let lightbox;

refs.loadMoreBtn.classList.add('hidden');
refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  const { searchQuery } = refs.form.elements;
  const value = searchQuery.value.trim();

  if (value === '') {
    console.error('Nothing to search');
    return Notiflix.Notify.info('Please enter something in the search field');
  }

  currentPage = 1;

  try {
    clearImageGallery();
    await fetchImages(value);
    refs.form.reset();
  } catch (error) {
    onError(error);
  }
}

function clearImageGallery() {
  refs.imageGallery.innerHTML = '';
}

async function fetchImages(value) {
  try {
    const { hits, totalHits } = await API.getPictures(value, currentPage);

    if (hits.length === 0) {
      throw new Error('No data');
    }

    const markup = hits.map(card => createMarkup(card)).join('');
    updateImageList(markup);

    const hasMoreImages = hits.length < totalHits;
    updateLoadMoreBtn(hasMoreImages);

    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    onError(error);
  }
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

  if (!hasMoreImages && currentPage === 1) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.removeEventListener('click', onLoadMore);
  }
}

function onError(error) {
  console.error(error);
  refs.loadMoreBtn.classList.add('hidden');

  const failureMessage =
    totalHits === 0
      ? 'Sorry, there are no images matching your search query'
      : "We're sorry, but you've reached the end of search results";
  Notiflix.Notify.failure(failureMessage);

  if (totalHits > 0) {
    refs.loadMoreBtn.removeEventListener('click', onLoadMore);
  }
}

async function onLoadMore() {
  currentPage += 1;

  try {
    await fetchImages(currentQuery);
    if (currentPage > 1 && totalHits === 0) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('hidden');
      refs.loadMoreBtn.removeEventListener('click', onLoadMore);
    }
  } catch (error) {
    onError(error);
  }
}
