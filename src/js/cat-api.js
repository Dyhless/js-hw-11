// Устанавливаем базовый URL для API
const BASE_URL = 'https://api.thecatapi.com/v1';
// Устанавливаем ключ API
const API_KEY = 'live_VhTrCGP65dIGzY8rmbUl7pgkAFfxbHetBgABGPGnLaQCFWyU5T7IvvATQNKs3Uhk';

// Определяем функцию fetchBreeds для получения списка пород
export function fetchBreeds() {
  // Формируем конечную точку URL для запроса списка пород
  const endpoint = `${BASE_URL}/breeds`;

  // Выполняем запрос с помощью функции fetch
  return fetch(endpoint, {
    headers: {
      'x-api-key': API_KEY,
    },
  })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Failed to fetch breeds'); // Выбрасываем ошибку в случае неудачного запроса
      }
      // Преобразуем ответ в формат JSON
      return response.json();
    })
    .then(data => {
      // Преобразуем полученные данные, чтобы они содержали только id и name породы
      return data.map(breed => ({
        id: breed.id,
        name: breed.name,
      }));
    });
}

// Определяем функцию fetchCatByBreed для получения информации о кошке по породе
export function fetchCatByBreed(breedId) {
  // Формируем конечную точку URL для запроса информации о кошке
  const endpoint = `${BASE_URL}/images/search?breed_ids=${breedId}`;

  // Выполняем запрос с помощью функции fetch
  return fetch(endpoint, {
    headers: {
      'x-api-key': API_KEY,
    },
  })
    .then(response => {
      // Проверяем, успешен ли ответ
      if (!response.ok) {
        throw new Error('Failed to fetch cat by breed'); // Выбрасываем ошибку в случае неудачного запроса
      }
      // Преобразуем ответ в формат JSON
      return response.json();
    })
    .then(data => {
      // Проверяем, получены ли данные и есть ли хотя бы одна кошка
      if (data && data.length > 0) {
        // Извлекаем информацию о породе кошки из полученных данных
        const catInfo = data[0].breeds[0];
        // Возвращаем объект с информацией о кошке, включая URL изображения, имя породы, описание и характер
        return {
          imageUrl: data[0].url,
          breedName: catInfo.name,
          description: catInfo.description,
          temperament: catInfo.temperament,
        };
      } else {
        throw new Error('No cat found for the selected breed'); // Выбрасываем ошибку, если не найдено ни одной кошки для выбранной породы
      }
    });
}
