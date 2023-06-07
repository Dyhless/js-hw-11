import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';
import Notiflix from 'notiflix';

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

refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) { 
   event.preventDefault();
   const form = event.currentTarget;
   const value = form.elements.searchQuery.value.trim();

   if (value === "") { 
      console.error("Nothing to search");
      return Notiflix.Notify.info('Please enter something in the search field');
   }

   API.getPictures(value)
      .then((picturesCards) => {
         // console.log(picturesCards);
         if (picturesCards.length === 0) throw new Error("No data");

         return picturesCards.reduce(
            (markup, card) => markup + createMarkup(card), "");
      })
      .then(updateImageList)
      .catch(onError);
}

function updateImageList(markup) { 
   refs.imageGallery.innerHTML = markup;

   // Initialization SimpleLightbox
   const lightbox = new SimpleLightbox('.photo-card img');
   lightbox.open();
}

function onError(error) { 
   console.error(error);
   Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again');
}
