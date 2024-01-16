import{S as p,a as i,i as f}from"./assets/vendor-89feecc5.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}})();const c=document.querySelector(".search-input"),h=document.querySelector(".search-form"),d=document.querySelector(".images-list"),g=document.querySelector(".gallery"),y=document.querySelector(".load_more_btn"),m=document.createElement("span");m.className="loader is-hidden";g.append(m);const n=document.querySelector(".loader"),b="41487030-c0d4f2e8fae3a5e9414bad560",v=new p(".gallery a",{captionsData:"alt",captionDelay:"250"});function u(){f.show({title:"",message:"Sorry, there are no images matching your search query. Please try again!",messageColor:"#FFFFFF",backgroundColor:"#EF4040",color:"#B51B1B",iconUrl:"./bi_x-octagon.svg",iconColor:"#FAFAFB",position:"topRight"})}function L(t){return console.log(t),t.reduce((s,r)=>s+`
    <li class="images-item">
      <a class="images-link" href="${r.largeImageURL}"><img class="images" data-source="${r.largeImageURL}" alt="${r.tags}" src="${r.webformatURL}" width="360" height="200"></a>
      <div class="description">
          <div>
            <p><b>Likes</b></p>
            <p>${r.likes}</p>
          </div>
          <div>
            <p><b>Views</b></p>
            <p>${r.views}</p>
          </div>
          <div>
            <p><b>Comments</b></p>
            <p>${r.comments}</p>
          </div>
        <div>
          <p><b>Downloads</b></p>
          <p>${r.downloads}</p>
        </div>
      </div>
    </li>
      `,"")}async function F(){try{const t=await i.get();return t.data.hits.length===0?u():(c.value="",n.classList.add("is-hidden"),d.innerHTML=L(t.data.hits),v.refresh(),y.classList.remove("is-hidden")),t}catch{d.innerHTML="",c.value="",n.classList.add("is-hidden"),u()}}const q=t=>{t.preventDefault(),n.classList.remove("is-hidden");const s=t.currentTarget.elements.query.value;i.defaults.baseURL="https://pixabay.com/api/",i.defaults.params={key:b,q:s,image_type:"photo",orientation:"horizontal",safesearch:"true"},F()};h.addEventListener("submit",q);
//# sourceMappingURL=commonHelpers.js.map
