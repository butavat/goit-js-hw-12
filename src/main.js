// main.js

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const API_KEY = '41732338-ca5909782120305119b6393dc';
let searchQuery = '';
const form = document.querySelector('.form');
const imagesGallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load_more_btn');
const loaderContainer = document.querySelector('.loader-container');
const preloader = document.querySelector('.preloader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: true,
  enableKeyboard: true,
  docClose: true,
});

const showLoader = (state) => {
  loader.style.display = state ? 'block' : 'none';
};

const showLoadMoreButton = (state) => {
  const shouldShow = state && imagesGallery.children.length >= 40;
  loadMoreButton.style.display = shouldShow ? 'flex' : 'none';
};

const toggleLoaderVisibility = (state) => {
  loaderContainer.style.display = state ? 'flex' : 'none';
};

const showPreloader = (state) => {
  preloader.style.display = state ? 'block' : 'none';
  if (state) {
    const searchInput = document.querySelector('.form input[name="search"]');
    const inputRect = searchInput.getBoundingClientRect();
    preloader.style.top = `${inputRect.bottom + 32}px`;
  }
};

const renderImages = (images) => {
  return images.reduce(
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

const fetchImages = async ({ query, page, perPage }) => {
  const BASE_URL = 'https://pixabay.com/api/?';

  try {
    showPreloader(true);

    const response = await axios.get(BASE_URL, {
      params: { key: API_KEY, q: query, page, per_page: perPage, image_type: 'photo', orientation: 'horizontal', safesearch: true },
    });

    if (response.data.hits.length === 0) {
      if (page === 1) {
        iziToast.error({
          position: 'bottomRight',
          messageColor: '#FFFFFF',
          backgroundColor: '#EF4040',
          titleSize: '8px',
          closeOnEscape: true,
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
      }
    } else {
      const cardHeight = imagesGallery.querySelector('.gallery-item')?.getBoundingClientRect().height;

      imagesGallery.insertAdjacentHTML('beforeend', renderImages(response.data.hits));
      lightbox.refresh();

      if (page * perPage >= response.data.totalHits) {
        showLoadMoreButton(false);
        iziToast.info({
          position: 'bottomRight',
          messageColor: '#FFFFFF',
          backgroundColor: '#3e4f65',
          titleSize: '8px',
          closeOnEscape: true,
          message: "We're sorry, but you've reached the end of search results.",
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
    iziToast.error({
      position: 'bottomRight',
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      titleSize: '8px',
      closeOnEscape: true,
      message: 'An error occurred while fetching images. Please try again.',
    });
  } finally {
    showPreloader(false);
    toggleLoaderVisibility(false);
  }
};

const loadMoreHandler = async () => {
  const apiRequestParams = {
    query: searchQuery,
    page: Math.ceil(imagesGallery.children.length / 40) + 1,
    perPage: 40,
  };

  toggleLoaderVisibility(true);
  await fetchImages(apiRequestParams);
};

const formSubmitHandler = async (event) => {
  event.preventDefault();
  toggleLoaderVisibility(true);
  showLoadMoreButton(false);
  const searchInput = event.target.elements.search;
  searchQuery = encodeURIComponent(searchInput.value.trim());

  if (searchQuery === '') {
    iziToast.error({
      position: 'bottomRight',
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      titleSize: '8px',
      closeOnEscape: true,
      message: 'Please enter a valid search query.',
    });
    toggleLoaderVisibility(false);
    return;
  }

  const apiRequestParams = {
    query: searchQuery,
    page: 1,
    perPage: 40,
  };

  imagesGallery.innerHTML = '';
  showLoader(true);

  await fetchImages(apiRequestParams);
  toggleLoaderVisibility(false);
  showLoadMoreButton(true);
};

form.addEventListener('submit', formSubmitHandler);

loadMoreButton.addEventListener('click', loadMoreHandler);

document.addEventListener('DOMContentLoaded', () => {
  const initialSearchTerm = searchQuery;
  if (initialSearchTerm) {
    formSubmitHandler({ target: { elements: { search: { value: initialSearchTerm } } } });
  }
});