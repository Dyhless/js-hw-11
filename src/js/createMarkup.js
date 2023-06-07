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
            <b>${likes}</b>
         </p>
         <p class="info-item">
            <b>${views}</b>
         </p>
         <p class="info-item">
            <b>${comments}</b>
         </p>
         <p class="info-item">
            <b>${downloads}</b>
         </p>
      </div>
   </div>
   `;
}
