export function createMarkup({
   webformatURL, tags, likes, views, comments, downloads
}) {
   return `
   <div class="photo-card">
      <a href="${webformatURL}" class="photo-link">
         <img src="${webformatURL}" alt="${tags}" loading="lazy" class="image-card" />
      </a>
      <div class="info">
         <p class="info-item">
            <b>Likes: ${likes}</b>
         </p>
         <p class="info-item">
            <b>Views: ${views}</b>
         </p>
         <p class="info-item">
            <b>Comments: ${comments}</b>
         </p>
         <p class="info-item">
            <b>Downloads: ${downloads}</b>
         </p>
      </div>
   </div>
   `;
}

export function formatImageData({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
  };
}
