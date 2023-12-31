import './sass/index.scss';
import NewsApiService from './api-service';//додавання джіес файлу
import { Notify } from 'notiflix/build/notiflix-notify-aio';//для повідомлень
import SimpleLightbox from 'simplelightbox';//додання бібліотеки
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

export { lightbox };

const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
let show = 0;// показано 0
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);


const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3,
};
const observer = new IntersectionObserver(onLoadMore, options);

function onSearch(element) {
  element.preventDefault();

  refs.galleryContainer.innerHTML = '';
  newsApiService.query =
    element.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');//заповніть основне поле
    return;
  }

  show = 0;
  fetchGallery();
  /*onRenderGallery(hits);*/ 
}

function onLoadMore() {
  newsApiService.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  refs.loadMore.classList.add('is-hidden');

  const result = await newsApiService.fetchGallery();
  const { hits, total } = result;
  show += hits.length;

  if (!hits.length) {
    Notify.failure(//якщо масив порожній повертає по вашому запиту нічго не знайдено, спробуйте ще раз
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.loadMore.classList.add('is-hidden');
    return;
  }

  onRenderGallery(hits);
  show += hits.length;

  if (show < total) {
    Notify.success(`Hooray! We found ${total} images !!!`);
    refs.loadMore.classList.remove('is-hidden');
  }

  if (show >= total) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }// досяягли результатів кінця пошуку і ховає кнопку
}

function onRenderGallery(elements) {// у відповіді на запит буде масив зображень з такими властивостями як вказані
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => { //Шаблон розмітки картки одного зображення для галереї
        return `<div class="photo-card"> 
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
