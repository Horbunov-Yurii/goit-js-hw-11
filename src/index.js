
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// 

const refs = {
    // ссылка на форму
  form: document.querySelector('.search-form'), 
//   button внутри формы
  formBtn: document.querySelector('.js-form-btn'),
//   div в который нужно рендарить карточки
  list: document.querySelector('.gallery'),
//   button для пагинации
  loadMoreBtn: document.querySelector('.load-more'),
//   кнопка для поднятия вверх страницы
  goTopBtn: document.querySelector('.back_to_top'),
};



refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.goTopBtn.addEventListener('click', backToTop);


let currentPage = 1; // 2
let currentQuery = "";// cat
const perPage = 40;

  const BASE_URL = 'https://pixabay.com/api/?';
 

async function onFormSubmit(evt){
  evt.preventDefault()
  currentQuery = evt.currentTarget.elements.query.value;

  refs.list.innerHTML = '';

  currentPage = 1;


  if(currentQuery.trim() === ''){

    refs.loadMoreBtn.classList.add('is-hidden');

  Notiflix.Notify.failure('Еnter the request in the picture');
  return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');


  const data = await fetchImages()

  

    if(!data.totalHits){
        refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
     setStateLoadButton(data);

    renderCard(data)

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }



async function fetchImages(){

   const queryParam = new URLSearchParams({
     key: '38625269-e94cc3b88596f307f4c7cd69d',
     image_type: 'photo',
     q: currentQuery, 
     orientation: 'horizontal',
     safesearch: true,
     page: currentPage,
     per_page: perPage,
   });

  const url = BASE_URL + queryParam;

 const res = await axios.get(url)
 
return res.data;
}


function renderCard({ hits }) {

  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="item">
      <div class="photo-card">
    <a href="${largeImageURL}">
     <img src="${webformatURL}" alt="${tags}" loading="lazy" class="card-img"/>
     </a>
  <div class="info">
  <div class="info-desc">
    <p class="info-item">
      <b>Likes</b>
      <p>${likes}</p>
    </p>
  </div> 
  <div class="info-desc"> 
    <p class="info-item">
      <b>Views</b>
      <p>${views}</p>
    </p>
  </div> 
  <div class="info-desc"> 
    <p class="info-item">
      <b>Comments</b>
      <p>${comments}</p>
    </p>
  </div>  
  <div class="info-desc">
    <p class="info-item">
      <b>Downloads</b>
      <p>${downloads}</p>
    </p>
  </div>  
  </div>
</div>
</div>`
    )
    .join('');

  refs.list.insertAdjacentHTML('beforeend', markup)
  lightbox.refresh()
}


async function onLoadMoreBtnClick(){
 currentPage +=1;

   const data = await fetchImages()
    renderCard(data);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    setStateLoadButton(data);
}

function setStateLoadButton(data){
     const totalPages = Math.ceil(data.totalHits / perPage);


     if (currentPage >= totalPages) {
       refs.loadMoreBtn.classList.add('is-hidden');
       Notiflix.Notify.info(
         "We're sorry, but you've reached the end of search results."
       );
     }
}


function backToTop(){
  window.scrollTo(0,0)
}


const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});




































// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const refs = {
//   form: document.querySelector('.search-form'),
//   formBtn: document.querySelector('.js-form-btn'),
//   list: document.querySelector('.gallery'),
//   loadMoreBtn: document.querySelector('.load-more'),
//   goTopBtn: document.querySelector('.back_to_top'),
// };

// refs.form.addEventListener('submit', onFormSubmit);
// refs.list.addEventListener('click', onPictureClick);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
// refs.goTopBtn.addEventListener('click', backToTop);
// window.addEventListener('scroll', trackScroll);

// let page = 1;

// function onFormSubmit(e) {
//   e.preventDefault();
//   const value = e.currentTarget.elements.query.value;
//   if (!value) {
//     refs.loadMoreBtn.classList.add('is-hidden');
//     return (refs.list.innerHTML = '');
//   }
//   const BASE_URL = 'https://pixabay.com/api/';
//   const queryParam = new URLSearchParams({
//     key: '23821952-b78db636c6ddcde4f5e93d8a9',
//     image_type: 'photo',
//     q: value,
//     orientation: 'horizontal',
//     safesearch: true,
//     page: 1,
//     per_page: 40,
//   });

//   fetch(`${BASE_URL}?${queryParam}&page=${page}&per_page=40`)
//     .then(res => res.json())
//     .then(data => {
//       renderCard(data);
//       refs.loadMoreBtn.classList.remove('is-hidden');
//     });

//   function renderCard({ hits }) {
//     refs.list.innerHTML = cardMarkup(hits).join('');
//   }
// }

// function cardMarkup(hits) {
//   return hits.map(
//     ({
//       webformatURL,
//       largeImageURL,
//       tags,
//       likes,
//       views,
//       comments,
//       downloads,
//     }) =>
//       `<div class="item">
// <div class="photo-card">
//   <img src="${webformatURL}" data-large-img=${largeImageURL} alt="${tags}" class="card-img"/>

//   <div class="stats js-starts">
//     <p class="info-item">
//       <b>Likes:</b>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views:</b>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments:</b>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads:</b>${downloads}
//     </p>
//   </div>
// </div>
// </div>`
//   );
// }

// function incrementPage() {
//   page += 1;
// }

// function onLoadMoreBtnClick() {
//   incrementPage();
//   const BASE_URL = 'https://pixabay.com/api/';
//   const queryParam = new URLSearchParams({
//     key: '23821952-b78db636c6ddcde4f5e93d8a9',
//     image_type: 'photo',
//     q: refs.form.elements.query.value,
//     orientation: 'horizontal',
//     safesearch: true,
//     page: 1,
//     per_page: 40,
//   });

//   fetch(`${BASE_URL}?${queryParam}&page=${page}`)
//     .then(res => res.json())
//     .then(data => {
//       renderCard(data);
//       refs.loadMoreBtn.classList.remove('is-hidden');
//       handleButtonClick();
//     });

//   function renderCard({ hits }) {
//     const markup = cardMarkup(hits);
//     refs.list.insertAdjacentHTML('beforeend', markup);
//   }
// }

// const hiddenElement = refs.loadMoreBtn;
// const btn = refs.formBtn;

// function handleButtonClick() {
//   hiddenElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
// }

// function onPictureClick(e) {
//   if (!e.target.classList.contains('card-img')) {
//     return;
//   }

//   const instance = SimpleLightbox.create(`
//     <img src="${e.target.dataset.largeImg}" width="800" height="600">
//   `);
//   instance.show();
// }

// function trackScroll() {
//   const scrolled = window.pageYOffset;
//   const coords = document.documentElement.clientHeight;

//   if (scrolled > coords) {
//     refs.goTopBtn.classList.add('back_to_top-show');
//   }
//   if (scrolled < coords) {
//     refs.goTopBtn.classList.remove('back_to_top-show');
//   }
// }

// function backToTop() {
//   if (window.pageYOffset > 0) {
//     window.scrollBy(0, -80);
//     setTimeout(backToTop, 0);
//   }
// }
