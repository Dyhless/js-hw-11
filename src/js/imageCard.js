const imageCard = {
  async openImage(imageURL) {
    window.open(imageURL, '_blank');
  },

  createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');

    const imageElement = document.createElement('img');
    imageElement.src = image.webformatURL;
    imageElement.alt = image.tags;

    imageElement.addEventListener('click', async () => {
      await this.openImage(image.largeImageURL);
    });

    card.appendChild(imageElement);
    return card;
  }
};

export default imageCard;
