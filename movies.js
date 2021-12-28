let api_key = "api_key=ed629527e659d619a50ef02b7d848011";
let Base_URL = "https://api.themoviedb.org/3";
let Api_URL = `${Base_URL}/discover/movie?sort_by=popularity.desc&${api_key}`;
let serachURL = `${Base_URL}/search/movie?${api_key}`;
let section_images = document.querySelector(".header__background-movies");
let movies_cards = document.querySelector(".movies__container");
let movies_section = document.querySelector(".movies");
let input_search = document.querySelector(".header__search-bar");

function removeClass(array, className) {
  array.forEach((ele) => {
    ele.classList.remove(className);
  });
}

function addClass(array, index, className) {
  for (let i = 0; i <= index; i++) {
    array[i].classList.add(className);
  }
}

function coloringStars(star_bar, icon) {
  let star_content = document.querySelector(".movies__star-rate p");
  let scale_star = document.querySelector(".movies__star-rate i");
  if (icon.dataset.rate > 0) star_content.innerHTML = icon.dataset.rate;
  for (let i = 0; i < icon.dataset.rate; i++) {
    star_bar[i].classList.add("color_star_rate");
  }
  star_bar.forEach((star, index) => {
    let rate_test;
    star.onmouseenter = () => {
      removeClass(star_bar, "color_star_rate");
      addClass(star_bar, index, "color_star_rate");
    };
    if (rate_test) {
      star.onmouseleave = () => {
        removeClass(star_bar, "color_star_rate");
      };
    }
    star.onclick = () => {
      rate_test = false;
      addClass(star_bar, index, "color_star_rate");
      scale_star.style.fontSize = `${(index + 1) * 4 + 80}px`;
      star_content.innerHTML = index + 1;
      icon.setAttribute("data-rate", index + 1);
      let btnRate = document.querySelector(".movies__rate-btn");
      btnRate.classList.remove("btn_rate_SP");
    };
    if (!rate_test) {
      star.parentElement.onmouseleave = () => {
        removeClass(star_bar, "color_star_rate");
        for (let i = 0; i < icon.dataset.rate; i++) {
          star_bar[i].classList.add("color_star_rate");
        }
      };
    }
  });
}

async function getmovies(movie) {
  let rep = await fetch(`${serachURL}&query=${movie}`);
  let repo = await rep.json();
  return repo;
}

function addmovies(alldata) {
  let newdata = alldata.filter((obj) => {
    return !!obj.backdrop_path;
  });
  newdata.forEach((data) => {
    let card = `
    <div class="movies__card">
        <div class="movies__image">
         <img
           src="https://image.tmdb.org/t/p/w500${data.backdrop_path}"
           class="bakdrop-movie"
         />
       </div>
       <div class="movies__description-content">
       <div class="movies__rating">
         <div class="movies__rate-star">
           <i class="fas fa-star star"></i>
           <p class="rate-number">${data.vote_average}</p>
         </div>
         <div class="movies__rate-icon">
           <i class="far fa-star rate-icon"></i>
         </div>
       </div>
       <div class="movies__title">
         <p class="movies__title-container" title="${data.title}">${data.title}</p>
       </div>
       <div class="movies__date">
       <p class="release_date">Release date : ${data.release_date}</p>
       </div>
       <div class="movies__popularity"><p class=p"opularity">Popularity : ${data.popularity}</p></div>
       <div class="movies__trailer">
         <span><i class="fas fa-play icon-trailer"></i></span
         ><span><p class="trailer-container">Trailer</p></span>
      </div>
       </div>
    </div>`;
    movies_cards.insertAdjacentHTML("afterbegin", card);
  });
}

function addPopupTrailer(res) {
  let movies_trailer = document.querySelectorAll(".movies__trailer");
  movies_trailer.forEach((ele) => {
    ele.onclick = async () => {
      let title = ele.parentElement.querySelector(
        ".movies__title-container"
      ).innerHTML;
      res.forEach((data) => {
        if (data.title == title) {
          id = data.id;
        }
      });
      let trailerSource = await getTrailer(id);
      let popupT = `<div class="movies__popup-trailer">
      <div class="movies__popup-content">
        <div class="movies__btn-exit"><i class="fas fa-times"></i></div>
        <div class="movies__section-trailer-title">
          <p class="movies__title-trailer">${title}</p>
          ${trailerSource}
        </div>
      </div>
    </div>`;
      movies_section.insertAdjacentHTML("afterbegin", popupT);
      let btn_exit = document.querySelector(".movies__btn-exit");
      btn_exit.onclick = () => {
        let popup_tariler = document.querySelector(".movies__popup-trailer");
        popup_tariler.remove();
      };
    };
  });
}

function addPopupRate() {
  let star_rate = document.querySelectorAll(".movies__rate-icon");
  star_rate.forEach((ele) => {
    ele.onclick = (e) => {
      e.stopPropagation();
      let popupR = `<div class="movies__rate-popup">
    <div class="movies__rate-containt">
      <div class="movies__btn-rate-exit"><i class="fas fa-times"></i></div>
      <div class="movies__star-rate">
        <p>?</p>
        <i class="fas fa-star"></i>
      </div>
      <div class="movies__rate-description">
        <div class="movies__rate-header"><h5>RATE THIS</h5></div>
        <div class="movies__rate-title"><h2>spider</h2></div>
        <div class="movies__star-bar">
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
          <i class="fas fa-star star-rate"></i>
        </div>
        <div class="movies__rate-btn"><p>Rate</p></div>
      </div>
    </div>
    </div>`;
      movies_section.insertAdjacentHTML("afterbegin", popupR);
      let title_rate = document.querySelector(".movies__rate-title h2");
      title_rate.innerHTML = ele
        .closest(".movies__card")
        .querySelector(".movies__title-container").innerHTML;
      let star_bar = document.querySelectorAll(".movies__star-bar i");
      let btnRate = document.querySelector(".movies__rate-btn");
      coloringStars(star_bar, ele);
      let popup_rate = document.querySelector(".movies__rate-popup");
      if (!ele.dataset.rate) btnRate.classList.add("btn_rate_SP");
      btnRate.onclick = () => {
        if (ele.dataset.rate) {
          ele.querySelector("i").classList.remove("far");
          ele.querySelector("i").classList.add("fas", "color_star_rate");
          btnRate.classList.remove("btn_rate_SP");
          popup_rate.remove();
        }
      };
      let btn_exit_rate = document.querySelector(".movies__btn-rate-exit");
      btn_exit_rate.onclick = () => {
        popup_rate.remove();
      };
    };
  });
}

function functionality(res) {
  addPopupTrailer(res);
  addPopupRate();
}

(async () => {
  let dataApi = await fetch(Api_URL);
  let repo = await dataApi.json();
  let result = repo.results;
  for (let i = 1; i <= 8; i++) {
    let html = `<div class="header__image"><img src="https://image.tmdb.org/t/p/w500${result[i].backdrop_path}"></div>`;
    section_images.insertAdjacentHTML("afterbegin", html);
  }
  addmovies(result);
  functionality(result);
  input_search.oninput = async () => {
    if (input_search.value != "") {
      movies_cards.innerHTML = "";
      let data = await getmovies(input_search.value);
      addmovies(data.results);
      functionality(data.results);
    }
  };
})();
// youtube video"https://www.youtube.com/watch?v=9Bvt6BFf6_U"

async function getTrailer(id) {
  try {
    let rep = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/trailers?api_key=ed629527e659d619a50ef02b7d848011`
    );
    let repo = await rep.json();
    let sourceYoutube = repo.youtube;
    let [sourceYoutubeFiltred] = sourceYoutube.filter((ele) => {
      return ele.type == "Trailer";
    });
    let lastres;
    if (sourceYoutubeFiltred != "" && sourceYoutubeFiltred) {
      lastres = `<iframe
      src="https://www.youtube.com/embed/${sourceYoutubeFiltred.source}"
    >
    </iframe>`;
      return lastres;
    } else {
      lastres = `<p class="movies__message-prob">nothing to show 🚫</p>`;
      return lastres;
    }
  } catch {
    (err) => {
      console.log(`something wrong${err}`);
    };
  }
}
