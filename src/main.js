'use strict';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
// Описаний у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const input = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const ul = document.querySelector('.images-list');
const divGallery = document.querySelector('.gallery'); //for spinner
const loadMoreBtn = document.querySelector('.load_more_btn');

// Створення нового елементу для завантажувача
const loaderElement = document.createElement('span');
loaderElement.className = 'loader is-hidden';

// Додавання завантажувача до списку
divGallery.append(loaderElement);

const loaderClass = document.querySelector('.loader');

const KEY = '41487030-c0d4f2e8fae3a5e9414bad560';

// Ініціалізація SimpleLightbox один раз поза обробником подій
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

// Виклик повідомлення з помилкою
function errorCommit() {
  iziToast.show({
    title: '',
    message:
      'Sorry, there are no images matching your search query. Please try again!',
    messageColor: '#FFFFFF',
    backgroundColor: '#EF4040',
    color: '#B51B1B',
    iconUrl: './bi_x-octagon.svg',
    iconColor: '#FAFAFB',
    position: 'topRight',
  });
}

function renderImages(request) {
  console.log(request);
  return request.reduce(
    (html, img) =>
      html +
      `
    <li class="images-item">
      <a class="images-link" href="${img.largeImageURL}"><img class="images" data-source="${img.largeImageURL}" alt="${img.tags}" src="${img.webformatURL}" width="360" height="200"></a>
      <div class="description">
          <div>
            <p><b>Likes</b></p>
            <p>${img.likes}</p>
          </div>
          <div>
            <p><b>Views</b></p>
            <p>${img.views}</p>
          </div>
          <div>
            <p><b>Comments</b></p>
            <p>${img.comments}</p>
          </div>
        <div>
          <p><b>Downloads</b></p>
          <p>${img.downloads}</p>
        </div>
      </div>
    </li>
      `,
    ''
  );
}

async function fetchImages() {
  try {
    const response = await axios.get();

    // Обробка помилки при відсутніх зображеннях
    if (response.data.hits.length === 0) {
      errorCommit();
    } else {
      input.value = '';
      // Приховання завантажувача після отримання результатів
      loaderClass.classList.add('is-hidden');
      // Рендер зображень
      ul.innerHTML = renderImages(response.data.hits);
      // Виклик методу для оновлення галереї
      lightbox.refresh();
      // Відображення кнопки Load more
      loadMoreBtn.classList.remove('is-hidden');
    }
    return response;
  } catch (error) {
    ul.innerHTML = '';
    input.value = '';
    // Приховання завантажувача після отримання результатів
    loaderClass.classList.add('is-hidden');
    errorCommit();
  }
}

const listener = event => {
  event.preventDefault();
  // Переключення видимості завантажувача
  loaderClass.classList.remove('is-hidden');

  const query = event.currentTarget.elements.query.value;

  axios.defaults.baseURL = 'https://pixabay.com/api/';
  axios.defaults.params = {
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };

  fetchImages();
};

form.addEventListener('submit', listener);