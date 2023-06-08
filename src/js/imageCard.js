function openImage(imageURL) {
   window.open(imageURL, '_blank');
}

function createImageCard(image) {
   const card = document.createElement('div');
   card.classList.add('card');

   const imageElement = document.createElement('img');
   imageElement.src = image.webformatURL;
   imageElement.alt = image.tags;

   imageElement.addEventListener('click', () => {
      openImage(image.largeImageURL);
   });

   card.appendChild(imageElement);
   return card;
}

export { createImageCard, openImage };
