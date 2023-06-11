import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

const { form, loadMoreBtn, imageGallery } = refs;
const lightbox = new SimpleLightbox('.photo-card a', { errorText: false });
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

loadMoreBtn.classList.add('hidden');
form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  const value = form.elements.searchQuery.value.trim();

  if (!value) {
    console.error('Nothing to search');
    return Notiflix.Notify.info('Please enter something in the search field');
  }

  currentQuery = value;
  currentPage = 1;

  try {
    await fetchImages();
    form.reset();
  } catch (error) {
    onError(error);
  }
}

function clearImageGallery() {
  imageGallery.innerHTML = '';
}

async function fetchImages() {
  try {
    const { hits, totalHits: currentTotalHits } = await API.getPictures(currentQuery, currentPage);

    if (!hits.length) {
      throw new Error('No data');
    }

    totalHits = currentTotalHits;
    const markup = hits.map(createMarkup).join('');
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
  imageGallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function updateLoadMoreBtn(hasMoreImages) {
  loadMoreBtn.classList.toggle('hidden', !hasMoreImages);

  if (!hasMoreImages && currentPage === 1) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.removeEventListener('click', onLoadMore);
  }
}

function onError(error) {
  console.error(error);
  loadMoreBtn.classList.add('hidden');

  const failureMessage = totalHits === 0
    ? 'Sorry, there are no images matching your search query'
    : "We're sorry, but you've reached the end of search results";
  Notiflix.Notify.failure(failureMessage);

  if (totalHits > 0) {
    loadMoreBtn.removeEventListener('click', onLoadMore);
  }
}

async function onLoadMore() {
  currentPage += 1;

  try {
    await fetchImages();
    if (currentPage > 1 && totalHits === 0) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('hidden');
      loadMoreBtn.removeEventListener('click', onLoadMore);
    }
  } catch (error) {
    onError(error);
  }
}
