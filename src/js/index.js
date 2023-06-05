import axios from 'axios';
import { BASE_URL, API_KEY } from './refs';
import { try1 } from './api';


(async () => {
  const date = await try1.getData(BASE_URL + API_KEY);
  console.log(date);
})();

