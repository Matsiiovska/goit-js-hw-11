import axios from "axios";

export default class NewsApiService {
  constructor() {//пагінація
    this.searchQuery = '';//пошуковий запит
    this.page = 1; //сторінки
    this.PER_PAGE = 40;
  }
  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: '38631612-cb45d4da8d92e0954f2c2005e',
        q: `${this.searchQuery}`,//список параметрів рядка запиту
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.PER_PAGE}`,
      },
      };
      
    try {
      const resp = await axios(axiosOptions);//відповідь

      const data = resp.data;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;// збільшуємо на 1
  }

  resetPage() {//скинути сторінку
    this.page = 1;//пошук за новим ключовим словом. Значення параметра повертаємо до початкового
  }

  resetEndOfHits() {//скинути кінець звернень
    this.endOfHits = false;
  }

  get query() {// запит
    return this.searchQuery; //повернути пошуковий запит
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}