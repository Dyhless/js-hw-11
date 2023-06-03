/*
https://www.thecocktaildb.comapi.php
*/

const refs = {
  input: document.querySelector('#input'),
  form: document.querySelector('#form'),
  button: document.querySelector('#button'),
}

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const inputValue = refs.input.value;
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${inputValue}`)
    .then(res => res.json())
      .then(date => console.log(date))
        .catch(error => console.log(error));
}