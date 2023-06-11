
export function createMarkup({
   webformatURL, largeImageURL, tags, likes, views, comments, downloads
}) {
   return `
   <div class="photo-card">
      <a href="${largeImageURL}" class="photo-link">
         <img src="${largeImageURL}" alt="${tags}" loading="lazy" class="image-card" />
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


