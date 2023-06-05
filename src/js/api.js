import axios from 'axios';
import { BASE_URL, API_KEY } from './refs';

export class FetchApi {
  async getData(BASE_URL, API_KEY) { 
    try {
      const fetch = await axios
        .get(BASE_URL, {
          params: { apikey: API_KEY, limmit: '100' }
        });
      
      return fetch.data.data.results;
    }
    catch (error) {
      console.log(error.message);
      return false;
    } 
  }
}

export const try1 = new FetchApi();
try1.getData(BASE_URL + API_KEY);
