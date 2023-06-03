/*
https://www.thecocktaildb.com/api.php
*/

const refs = {
  input: document.querySelector('#input'),
  form: document.querySelector('#form'),
  button: document.querySelector('button'),
  divDrinks: document.querySelector('.container'),
}

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const inputValue = refs.input.value;
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputValue}`)
    .then(res => res.json())
      .then(date => renderDrinks(date.drinks))
        .catch(error => console.log(error));
}

function drinkMarkup({ strDrinkThumb, strDrink }) {
  const markup = 
  `<div>
    <img src = "${strDrinkThumb}" alt = "${strDrink}" width = "200">
    <h1>${strDrink}</h1>
  </div>`;
  refs.divDrinks.insertAdjacentHTML('afterend', markup);
}

function renderDrinks(array) {
  array.forEach(element => drinkMarkup(element));
}