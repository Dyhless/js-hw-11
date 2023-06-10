import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

let currentPage = 1;
let lightbox;
let currentQuery = '';
let totalHits = 0;
let loadedImages = 0;

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

  currentQuery = value;
  currentPage = 1;

  try {
    clearImageGallery();
    await fetchImages();
    refs.form.reset();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    onError(error);
  }
}

function clearImageGallery() {
  refs.imageGallery.innerHTML = '';
  loadedImages = 0;
}

async function fetchImages() {
  try {
    const { images, total } = await API.getPictures(currentQuery, currentPage);

    if (images.length === 0) {
      throw new Error('No data');
    }

    totalHits = total;

    const hasMoreImages = images.length < totalHits;

    const markup = images.reduce((acc, card) => acc + createMarkup(card), '');
    updateImageList(markup);

    updateLoadMoreBtn(hasMoreImages);
  } catch (error) {
    onError(error);
  }
}

function updateImageList(markup) {
  refs.imageGallery.insertAdjacentHTML('beforeend', markup);
  initializeLightbox();
  loadedImages += 1;
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
  if (!hasMoreImages) {
    refs.loadMoreBtn.classList.add('hidden');
    if (loadedImages === totalHits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } else {
    refs.loadMoreBtn.classList.remove('hidden');
  }
}

function onError(error) {
  console.error(error);
  refs.loadMoreBtn.classList.add('hidden');
  if (loadedImages === totalHits) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    Notiflix.Notify.info('Sorry, there are no images matching your search query');
  }
}

async function onLoadMore() {
  currentPage += 1;

  try {
    await fetchImages();
  } catch (error) {
    onError(error);
  }
}
