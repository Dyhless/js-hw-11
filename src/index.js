import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { refs } from './js/refs.js';
import API from './js/api.js';

console.log(API);

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
   event.peventDefault();
   const form = event.currentTarget;
   const value = form.elements.value.trim();
   API.getPictures(value).then((result) => console.log(result));
}
