// document.addEventListener("DOMContentLoaded", () => {
//   const slides = [
//     {
//       image: "./images/coffee-slider-1.png",
//       title: "S’mores Frappuccino",
//       text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
//       price: "$5.50",
//     },
//     {
//       image: "./images/coffee-slider-2.png",
//       title: "Caramel Latte",
//       text: "Rich espresso blended with steamed milk and caramel syrup, topped with foam.",
//       price: "$4.90",
//     },
//     {
//       image: "./images/coffee-slider-3.png",
//       title: "Vanilla Cold Brew",
//       text: "Smooth cold brew coffee with a touch of vanilla and cream.",
//       price: "$5.20",
//     },
//   ];

//   const slideImage = document.querySelector(".favorite__slide__image");
//   const slideTitle = document.querySelector(".farovite__slide__title");
//   const slideText = document.querySelector(".farovite__slide__text");
//   const slidePrice = document.querySelector(".farovite__slide__price");

//   const points = document.querySelectorAll(".favorite__slide__point");
//   const btnLeft = document.querySelector(".favorite__icon__left");
//   const btnRight = document.querySelector(".favorite__icon__right");
//   const slider = document.querySelector(".favorite__sliders");

//   let currentIndex = 0;
//   const intervalTime = 6000; // 6 seconds
//   let interval;
//   let startTime = 0;
//   let progressTime = 0;
//   let isPaused = false;

//   // --- Helper: slaydni yangilash
//   function updateSlide(index) {
//     const slide = slides[index];
//     slideImage.src = slide.image;
//     slideTitle.textContent = slide.title;
//     slideText.textContent = slide.text;
//     slidePrice.textContent = slide.price;

//     points.forEach((p, i) => {
//       p.classList.remove("favorite__slide__point-active");
//       p.style.setProperty("--progress", "0%");
//     });
//     points[index].classList.add("favorite__slide__point-active");
//     animateProgressBar(index);
//   }

//   // --- Progress barni to‘ldirish
//   function animateProgressBar(index) {
//     const point = points[index];
//     point.style.transition = "none";
//     point.querySelector("::after");
//     setTimeout(() => {
//       point.style.transition = `width ${intervalTime}ms linear`;
//       point.classList.add("favorite__slide__point-active");
//     });
//   }

//   // --- Slaydni avtomatik o‘tkazish
//   function startCarousel() {
//     interval = setInterval(() => {
//       nextSlide();
//     }, intervalTime);
//   }

//   function pauseCarousel() {
//     clearInterval(interval);
//   }

//   // --- Oldingi / Keyingi slayd
//   function nextSlide() {
//     currentIndex = (currentIndex + 1) % slides.length;
//     updateSlide(currentIndex);
//   }

//   function prevSlide() {
//     currentIndex = (currentIndex - 1 + slides.length) % slides.length;
//     updateSlide(currentIndex);
//   }

//   // --- Tugmalar bosilganda
//   btnRight.addEventListener("click", () => {
//     pauseCarousel();
//     nextSlide();
//     startCarousel();
//   });

//   btnLeft.addEventListener("click", () => {
//     pauseCarousel();
//     prevSlide();
//     startCarousel();
//   });

//   // --- Hover / Touch hold paytida pauza
//   slider.addEventListener("mouseenter", pauseCarousel);
//   slider.addEventListener("mouseleave", startCarousel);

//   // --- Swipe funksiyasi (mobil)
//   let touchStartX = 0;
//   slider.addEventListener("touchstart", (e) => {
//     touchStartX = e.touches[0].clientX;
//     pauseCarousel();
//   });

//   slider.addEventListener("touchend", (e) => {
//     const touchEndX = e.changedTouches[0].clientX;
//     if (touchStartX - touchEndX > 50) nextSlide(); // swipe left
//     if (touchEndX - touchStartX > 50) prevSlide(); // swipe right
//     startCarousel();
//   });

//   // --- Boshlash
//   updateSlide(currentIndex);
//   startCarousel();
// });
const slides = [
  {
    img: "./images/coffee-slider-1.png",
    title: "S’mores Frappuccino",
    text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
    price: "$5.50",
  },
  {
    img: "./images/coffee-slider-2.png",
    title: "Caramel Macchiato",
    text: "Rich espresso blended with creamy milk and caramel drizzle, topped with whipped cream for a smooth finish.",
    price: "$4.80",
  },
  {
    img: "./images/coffee-slider-3.png",
    title: "Iced Mocha Latte",
    text: "Refreshing iced espresso with chocolate syrup and a touch of milk — the perfect cool pick-me-up.",
    price: "$5.20",
  },
];

const slideContainer = document.querySelector(".favorite__slide__center");
const leftBtn = document.querySelector(".favorite__icon__left");
const rightBtn = document.querySelector(".favorite__icon__right");
const points = document.querySelectorAll(".favorite__slide__point");
const favoriteSection = document.querySelector(".favorite");

let currentIndex = 0;
let autoSlideInterval;
let progress = 0;
let progressInterval;

// Slaydni ko‘rsatish
function showSlide(index) {
  const s = slides[index];
  slideContainer.innerHTML = `
    <img class="favorite__slide__image" src="${s.img}" alt="${s.title}" />
    <h3 class="farovite__slide__title">${s.title}</h3>
    <p class="farovite__slide__text">${s.text}</p>
    <strong class="farovite__slide__price">${s.price}</strong>
  `;

  points.forEach((p, i) => {
    p.classList.toggle("favorite__slide__point-active", i === index);
    p.style.background = i === index ? "#665f55" : "#c1b6ad";
    p.style.width = i === index ? `${progress}%` : "40px";
  });
}

// Progress barni boshqarish
function startProgress() {
  clearInterval(progressInterval);
  progress = 0;
  progressInterval = setInterval(() => {
    progress += 2; // har 100ms da 2% (5 sekund = 100%)
    points[currentIndex].style.background = "#665f55";
    points[currentIndex].style.width = `${(progress / 100) * 40}px`; // 40px = to‘liq eni
    if (progress >= 100) {
      nextSlide();
    }
  }, 100);
}

// Avtomatik aylanish
function startAutoSlide() {
  clearInterval(autoSlideInterval);
  startProgress();
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

// Hoverda to‘xtash
favoriteSection.addEventListener("mouseenter", () => {
  clearInterval(autoSlideInterval);
  clearInterval(progressInterval);
});
favoriteSection.addEventListener("mouseleave", startAutoSlide);

// Chap/o‘ng o‘tish
function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
  startAutoSlide();
}
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
  startAutoSlide();
}

leftBtn.addEventListener("click", prevSlide);
rightBtn.addEventListener("click", nextSlide);

// Dastlabki ishga tushirish
showSlide(currentIndex);
startAutoSlide();
