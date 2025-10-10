document.addEventListener("DOMContentLoaded", () => {
  const slides = [
    {
      image: "./images/coffee-slider-1.png",
      title: "S’mores Frappuccino",
      text: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50",
    },
    {
      image: "./images/coffee-slider-2.png",
      title: "Caramel Latte",
      text: "Rich espresso blended with steamed milk and caramel syrup, topped with foam.",
      price: "$4.90",
    },
    {
      image: "./images/coffee-slider-3.png",
      title: "Vanilla Cold Brew",
      text: "Smooth cold brew coffee with a touch of vanilla and cream.",
      price: "$5.20",
    },
  ];

  const slideImage = document.querySelector(".favorite__slide__image");
  const slideTitle = document.querySelector(".farovite__slide__title");
  const slideText = document.querySelector(".farovite__slide__text");
  const slidePrice = document.querySelector(".farovite__slide__price");

  const points = document.querySelectorAll(".favorite__slide__point");
  const btnLeft = document.querySelector(".favorite__icon__left");
  const btnRight = document.querySelector(".favorite__icon__right");
  const slider = document.querySelector(".favorite__sliders");

  let currentIndex = 0;
  const intervalTime = 6000; // 6 seconds
  let interval;
  let startTime = 0;
  let progressTime = 0;
  let isPaused = false;

  // --- Helper: slaydni yangilash
  function updateSlide(index) {
    const slide = slides[index];
    slideImage.src = slide.image;
    slideTitle.textContent = slide.title;
    slideText.textContent = slide.text;
    slidePrice.textContent = slide.price;

    points.forEach((p, i) => {
      p.classList.remove("favorite__slide__point-active");
      p.style.setProperty("--progress", "0%");
    });
    points[index].classList.add("favorite__slide__point-active");
    animateProgressBar(index);
  }

  // --- Progress barni to‘ldirish
  function animateProgressBar(index) {
    const point = points[index];
    point.style.transition = "none";
    point.querySelector("::after");
    setTimeout(() => {
      point.style.transition = `width ${intervalTime}ms linear`;
      point.classList.add("favorite__slide__point-active");
    });
  }

  // --- Slaydni avtomatik o‘tkazish
  function startCarousel() {
    interval = setInterval(() => {
      nextSlide();
    }, intervalTime);
  }

  function pauseCarousel() {
    clearInterval(interval);
  }

  // --- Oldingi / Keyingi slayd
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide(currentIndex);
  }

  // --- Tugmalar bosilganda
  btnRight.addEventListener("click", () => {
    pauseCarousel();
    nextSlide();
    startCarousel();
  });

  btnLeft.addEventListener("click", () => {
    pauseCarousel();
    prevSlide();
    startCarousel();
  });

  // --- Hover / Touch hold paytida pauza
  slider.addEventListener("mouseenter", pauseCarousel);
  slider.addEventListener("mouseleave", startCarousel);

  // --- Swipe funksiyasi (mobil)
  let touchStartX = 0;
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    pauseCarousel();
  });

  slider.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) nextSlide(); // swipe left
    if (touchEndX - touchStartX > 50) prevSlide(); // swipe right
    startCarousel();
  });

  // --- Boshlash
  updateSlide(currentIndex);
  startCarousel();
});
