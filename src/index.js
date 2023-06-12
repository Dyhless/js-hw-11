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
    this.perPage = 40;
    this.isEndOfResults = false;

    this.loadMoreBtn.classList.add('hidden');
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.loadMoreBtn.addEventListener('click', this.onLoadMore.bind(this));
  }

  async onSubmit(event) {
    event.preventDefault();
    const value = this.form.elements.searchQuery.value.trim();

    if (!value) {
      this.clearPage();
      Notiflix.Notify.failure('Please enter something in the search field.');
      return;
    }

    this.currentQuery = value;
    this.currentPage = 1;

    try {
      await this.fetchImages();
      this.form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  clearPage() {
    this.imageGallery.innerHTML = '';
    this.hideLoadMoreBtn();
  }

  onError(error) {
    console.error(error);

    if (this.totalHits === 0) {
      this.clearPage();
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  }

  async fetchImages() {
    try {
      const { hits, totalHits } = await API.getPictures(this.currentQuery, this.currentPage, this.perPage);

      if (!hits.length && this.currentPage === 1) {
        this.hideLoadMoreBtn();
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        this.clearPage(); 
        return;
      }

      this.totalHits = totalHits;
      const markup = hits.map(createMarkup).join('');
      this.renderImages(markup);

      const totalPages = Math.ceil(this.totalHits / this.perPage);
      const hasMoreImages = this.currentPage < totalPages;
      this.updateLoadMoreBtn(hasMoreImages);

      if (this.currentPage === 1 && !this.isEndOfResults) {
        Notiflix.Notify.success(`Hooray! We found ${this.totalHits} images.`);
      }
    } catch (error) {
      this.onError(error);
    }
  }

  renderImages(markup) {
    if (this.currentPage === 1) {
      this.imageGallery.innerHTML = markup;
    } else {
      this.imageGallery.insertAdjacentHTML('beforeend', markup);
    }
    this.lightbox.refresh();
  }

  updateLoadMoreBtn(hasMoreImages) {
    if (hasMoreImages) {
      this.showLoadMoreBtn();
    } else {
      this.hideLoadMoreBtn();
      if (!this.isEndOfResults) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        this.isEndOfResults = true;
      }
      this.loadMoreBtn.removeEventListener('click', this.onLoadMore);
    }
  }

  showLoadMoreBtn() {
    this.loadMoreBtn.classList.remove('hidden');
  }

  hideLoadMoreBtn() {
    this.loadMoreBtn.classList.add('hidden');
  }

  async onLoadMore() {
    this.currentPage += 1;

    try {
      await this.fetchImages();
    } catch (error) {
      this.onError(error);
    }
  }
}

new ImageGallery();
