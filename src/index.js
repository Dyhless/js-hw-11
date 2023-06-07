import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';


import { refs } from './js/refs.js';
import API from './js/api.js';
import { createMarkup } from './js/createMarkup.js';


/*

1. Get refs 
2. Create querySelector on submit 
3. Get request form input and sent to server like query parametr
4. Check the server response
 4.1 in case the nagative response, notify the user
5. Get results and literate through the array and create the markup
   (gether everything in one line)
6. Show the markup to user (innerHTML)
7. Clear the form    

*/

let currentPage = 1;

refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) {
   event.preventDefault();
   const form = event.currentTarget;
   const value = form.elements.searchQuery.value.trim();

   if (value === "") {
      console.error("Nothing to search");
      return Notiflix.Notify.info('Please enter something in the search field');
   }

   currentPage = 1; // Сброс значения текущей страницы при новом поиске
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
      })
      .catch(onError);
}

function onError(error) {
   console.error(error);
   Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again');
}

function updateImageList(markup) {
   refs.imageGallery.innerHTML = markup;

   // Initialization SimpleLightbox
   const lightbox = new SimpleLightbox('.photo-card img');
   lightbox.open();
}

function updateLoadMoreBtn(totalHits, imagesLength) {
   if (imagesLength < totalHits) {
      refs.loadMoreBtn.style.display = 'block';
   } else {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
   }
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
   currentPage += 1; // Увеличение значения текущей страницы при нажатии на кнопку "Load more"
   const value = refs.form.elements.searchQuery.value.trim();
   fetchImages(value, currentPage);
}

