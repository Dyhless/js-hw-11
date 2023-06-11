import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';
import { refs } from './js/refs.js';

class ImageGallery {
  constructor() {
    const { form, loadMoreBtn, imageGallery } = refs;
    this.form = form;
    this.loadMoreBtn = loadMoreBtn;
    this.imageGallery = imageGallery;
    this.lightbox = new SimpleLightbox('.photo-card a', { errorText: false });
    this.currentPage = 1;
    this.currentQuery = '';
    this.totalHits = 0;

    this.loadMoreBtn.classList.add('hidden');
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.loadMoreBtn.addEventListener('click', this.onLoadMore.bind(this));
  }

  async onSubmit(event) {
    event.preventDefault();
    const value = this.form.elements.searchQuery.value.trim();

    if (!value) {
      console.error('Nothing to search');
      return Notiflix.Notify.info('Please enter something in the search field');
    }

    this.currentQuery = value;
    this.currentPage = 1;

    try {
      await this.fetchImages();
      this.form.reset();
    } catch (error) {
      this.onError(error);
    }
  }

  async fetchImages() {
    try {
      const { hits, totalHits: currentTotalHits } = await API.getPictures(
        this.currentQuery,
        this.currentPage
      );

      if (!hits.length) {
        throw new Error('No data');
      }

      this.totalHits = currentTotalHits;
      const markup = hits.map(createMarkup).join('');
      this.updateImageList(markup);

      const hasMoreImages = hits.length < this.totalHits;
      this.updateLoadMoreBtn(hasMoreImages);

      if (this.currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${this.totalHits} images.`);
      }
    } catch (error) {
      this.onError(error);
    }
  }

  updateImageList(markup) {
    if (this.currentPage === 1) {
      this.imageGallery.innerHTML = markup;
    } else {
      this.imageGallery.insertAdjacentHTML('beforeend', markup);
    }
    this.lightbox.refresh();
  }

  updateLoadMoreBtn(hasMoreImages) {
    this.loadMoreBtn.classList.toggle('hidden', !hasMoreImages);

    if (!hasMoreImages && this.currentPage === 1) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      this.loadMoreBtn.removeEventListener('click', this.onLoadMore.bind(this));
    }
  }

  onError(error) {
    console.error(error);
    this.loadMoreBtn.classList.add('hidden');

    const failureMessage =
      this.totalHits === 0
        ? 'Sorry, there are no images matching your search query'
        : "We're sorry, but you've reached the end of search results";
    Notiflix.Notify.failure(failureMessage);

    if (this.totalHits > 0) {
      this.loadMoreBtn.removeEventListener('click', this.onLoadMore.bind(this));
    }
  }

  async onLoadMore() {
    this.currentPage += 1;

    try {
      await this.fetchImages();
      if (this.currentPage > 1 && this.totalHits === 0) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        this.loadMoreBtn.classList.add('hidden');
        this.loadMoreBtn.removeEventListener('click', this.onLoadMore.bind(this));
      }
    } catch (error) {
      this.onError(error);
    }
  }
}

new ImageGallery();
