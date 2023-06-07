import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import { refs } from './js/refs.js';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';

let currentPage = 1;
let lightbox;

refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) {
   event.preventDefault();
   const form = event.currentTarget;
   const value = form.elements.searchQuery.value.trim();

   if (value === "") {
      console.error("Nothing to search");
      return Notiflix.Notify.info('Please enter something in the search field');
   }

   currentPage = 1; // Resetting the current page value for a new search
   fetchImages(value, currentPage);
}

function fetchImages(query, page) {
   API.getPictures(query, page)
      .then(({ images, totalHits }) => {
         if (images.length === 0) throw new Error("No data");

         const markup = images.reduce((acc, card) => acc + createMarkup(card), "");
         updateImageList(markup);

         const imagesLength = images.length;
         updateLoadMoreBtn(totalHits, imagesLength);

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
         errorText: false, // Disable the image loading error warning
      });
   }
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
   currentPage += 1; // Increasing the value when clicking on the "Load more" button
   const value = refs.form.elements.searchQuery.value.trim();
   fetchImages(value, currentPage);
}
