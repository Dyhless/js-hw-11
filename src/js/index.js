// Импорт необходимых модулей
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import * as catApi from './cat-api.js';

// Определение ссылок на HTML-элементы
const breedSelect = document.querySelector('.breed-select');
const loadingElement = document.querySelector('.loading');
const errorElement = document.querySelector('.error');
const catInfoContainer = document.querySelector('.cat-info');
const loaderElement = document.querySelector('.loader');

// Скрытие элементов загрузки и ошибки
loadingElement.style.display = 'block';
errorElement.style.display = 'none';
// Обработчик события загрузки контента страницы
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация SlimSelect для выбора породы
  new SlimSelect({
    select: 'breed-select',
    showContent: 'down',
    placeholder: 'Select a breed',
    allowDeselect: true,
    deselectLabel: '<span class="placeholder-text">Select a breed</span>',
    searchable: false,
  });

// Функция для получения информации о кошке по породе
  function getCatInfoByBreed(selectedBreedId) {
    // Показать элемент загрузки
    loadingElement.style.display = 'block';

  return catApi
  .fetchCatByBreed(selectedBreedId)
  .then((catInfo) => {
    // Формирование HTML с информацией о кошке
    const catInfoHTML = `
      <img src="${catInfo.imageUrl}">
      <p>Breed: ${catInfo.breedName}</p>
      <p>Description: ${catInfo.description}</p>
      <p>Temperament: ${catInfo.temperament}</p>
    `;
    // Вставка HTML с информацией о кошке в контейнер и отображение контейнера
    catInfoContainer.innerHTML = catInfoHTML;
    catInfoContainer.style.display = 'block';
    // Скрытие элемента загрузки
    loaderElement.style.display = 'none';
  })
  .catch((error) => {
    console.error(error);
    // Скрытие элемента загрузки и вывод уведомления об ошибке
    loaderElement.classList.remove('visible');
    Notiflix.Notify.failure('Произошла ошибка. Пожалуйста, повторите попытку позже.');
    // Показать уведомление в случае ошибки загрузки
    errorElement.style.display = 'block';
  });
  }

// Обработчик события изменения выбора породы
breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;
  // Получение информации о кошке по выбранной породе
  getCatInfoByBreed(selectedBreedId);
  // Скрытие элементов загрузки и ошибки
  loadingElement.style.display = 'none';
  errorElement.style.display = 'none';
});
// Получение списка пород и заполнение выбора породы
catApi.fetchBreeds()
  .then((breeds) => {
    breeds.forEach((breed) => {
      // Создание и добавление элемента <option> в выбор породы
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
    // Включение выбора породы и скрытие элемента загрузки после успешной загрузки списка пород
    breedSelect.disabled = false;
    // Скрытие элемента загрузки
    loadingElement.style.display = 'none';
  })
  .catch((error) => {
    console.error(error);
    // Вывод уведомления об ошибке и скрытие элемента загрузки в случае ошибки при загрузке списка пород
    Notiflix.Notify.failure('Не удалось загрузить список пород. Пожалуйста, повторите попытку позже.');
    loadingElement.style.display = 'none';
  });
});
