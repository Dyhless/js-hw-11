import axios from 'axios';

class API {
  constructor() {
    this.BASE_URL = 'https://pixabay.com/api/';
    this.API_KEY = '37053026-4150c05ae3a340932daa6308e';
  }

  async getPictures(query, page = 1, per_page = 40) {
    const url = `${this.BASE_URL}?key=${this.API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;
    const response = await axios.get(url);

    return response.data;
  }
}

export default new API();
