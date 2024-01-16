// main.js

'use strict';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.form');
const imagesGallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load_more_btn');
const loaderContainer = document.querySelector('.loader-container');

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '41732338-ca5909782120305119b6393dc';

const searchParamsDefault = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: true,
  enableKeyboard: true,
  docClose: true,
});

const showLoader = state => {
  loader.style.display = state ? 'block' : 'none';
};

const showLoadMoreButton = state => {
  loadMoreButton.style.display = state ? 'flex' : 'none';
};

const toggleLoaderVisibility = state => {
  loaderContainer.style.display = state ? 'flex' : 'none';
};

const renderImages = request => {
  return request.reduce(
    (html, img) =>
      html +
      `
    <li class="gallery-item">
      <a href="${img.largeImageURL}"> 
        <img class="gallery-img" src="${img.webformatURL}" alt="${img.tags}" />
      </a>
      <div class="gallery-text-box">
        <p>Likes: <span class="text-value">${img.likes}</span></p>
        <p>Views: <span class="text-value">${img.views}</span></p>
        <p>Comments: <span class="text-value">${img.comments}</span></p>
        <p>Downloads: <span class="text-value">${img.downloads}</span></p>
      </div>
    </li>
    `,
    ''
  );
};

const fetchImages = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { ...searchParamsDefault, page: searchParamsDefault.page, q: searchParamsDefault.q },
    });

    if (response.data.hits.length === 0) {
      iziToast.error({
        position: 'bottomCenter',
        messageColor: '#FFFFFF',
        backgroundColor: '#EF4040',
        titleSize: '8px',
        closeOnEscape: true,
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      const cardHeight = imagesGallery.querySelector('.gallery-item')
        ?.getBoundingClientRect().height;

      imagesGallery.innerHTML += renderImages(response.data.hits);
      lightbox.refresh();

      if (
        searchParamsDefault.page * searchParamsDefault.per_page >=
        response.data.totalHits
      ) {
        showLoadMoreButton(false);
        iziToast.info({
          position: 'bottomCenter',
          messageColor: '#FFFFFF',
          backgroundColor: '#3e4f65',
          titleSize: '8px',
          closeOnEscape: true,
          message:
            "We're sorry, but you've reached the end of search results.",
        });
      } else {
        showLoadMoreButton(true);
      }

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    toggleLoaderVisibility(false);
  }
};

const loadMoreHandler = () => {
  searchParamsDefault.page += 1;
  toggleLoaderVisibility(true); // Показуємо індикатор завантаження перед завантаженням зображень
  fetchImages();
};

const formSubmitHandler = async event => {
  event.preventDefault();
  toggleLoaderVisibility(true); // Показуємо індикатор завантаження перед пошуком
  showLoadMoreButton(false); // Ховаємо кнопку "Load more" перед пошуком
  const searchInput = event.target.elements.search;
  const searchTerm = encodeURIComponent(searchInput.value.trim());

  if (searchTerm === '') {
    console.error('Please enter a valid search query.');
    toggleLoaderVisibility(false);
    return;
  }

  searchParamsDefault.q = searchTerm;
  searchParamsDefault.page = 1;

  imagesGallery.innerHTML = ''; // Очищуємо галерею при новому пошуку

  await fetchImages();
  toggleLoaderVisibility(false);
  showLoadMoreButton(true);
  // Зберігаємо значення пошукового терміну для подальших запитів
  form.dataset.searchTerm = searchTerm;
};

// Додаємо обробник сабміту форми
form.addEventListener('submit', formSubmitHandler);

// Додаємо обробник для кнопки "Load more"
loadMoreButton.addEventListener('click', loadMoreHandler);

// Перевірка видимості кнопки "Load more" при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  const initialSearchTerm = form.dataset.searchTerm;
  if (initialSearchTerm) {
    formSubmitHandler({ target: { elements: { search: { value: initialSearchTerm } } } });
  }
});