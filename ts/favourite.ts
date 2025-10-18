interface Slide {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
}

const slideContainer = document.querySelector<HTMLDivElement>(
  ".favorite__slide__center"
)!;
const leftBtn = document.querySelector<HTMLButtonElement>(
  ".favorite__icon__left"
)!;
const rightBtn = document.querySelector<HTMLButtonElement>(
  ".favorite__icon__right"
)!;
const points = document.querySelectorAll<HTMLDivElement>(
  ".favorite__slide__point"
);
const favoriteSection = document.querySelector<HTMLDivElement>(".favorite")!;
const loader = document.getElementById("loader") as HTMLElement;
const errorBox = document.getElementById("error") as HTMLElement;

let slides: Slide[] = [];
let currentIndex = 0;
let autoSlideInterval: number | undefined;
let progress = 0;
let progressInterval: number | undefined;

async function fetchSlides() {
  try {
    loader.classList.remove("favorite__error--hidden");
    errorBox.classList.add("favorite__error--hidden");
    slideContainer.classList.add("favorite__error--hidden");

    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/favorites"
    );
    if (!res.ok) throw new Error("Network error");

    const result = await res.json();
    slides = result.data; // ✅ Faqat data massivini olamiz

    loader.classList.add("favorite__error--hidden");
    slideContainer.classList.remove("favorite__error--hidden");

    showSlide(currentIndex);
    startAutoSlide();
  } catch (err) {
    console.error("❌ Error:", err);
    loader.classList.add("favorite__error--hidden");
    errorBox.textContent = "Something went wrong. Please, refresh the page.";
    errorBox.classList.remove("favorite__error--hidden");
  }
}

// Slaydni ko‘rsatish
function showSlide(index: number): void {
  const s = slides[index];
  slideContainer.innerHTML = `
    <img class="favorite__slide__image" src="../images/coffee-slider-${
      index + 1
    }.png" alt="${s.name}" />
    <h3 class="farovite__slide__title">${s.name}</h3>
    <p class="farovite__slide__text">${s.description}</p>
    <strong class="farovite__slide__price">$${s.price}</strong>
  `;

  points.forEach((p, i) => {
    p.classList.toggle("favorite__slide__point-active", i === index);
    p.style.background = i === index ? "#665f55" : "#c1b6ad";
    p.style.width = i === index ? `${progress}%` : "40px";
  });
}

// Progress barni boshqarish
function startProgress(): void {
  if (progressInterval) clearInterval(progressInterval);
  progress = 0;
  progressInterval = window.setInterval(() => {
    progress += 2;
    points[currentIndex].style.width = `${(progress / 100) * 40}px`;
    if (progress >= 100) {
      nextSlide();
    }
  }, 100);
}

// Avtomatik aylanish
function startAutoSlide(): void {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  startProgress();
  autoSlideInterval = window.setInterval(nextSlide, 5000);
}

function prevSlide(): void {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
  startAutoSlide();
}

function nextSlide(): void {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
  startAutoSlide();
}

leftBtn.addEventListener("click", prevSlide);
rightBtn.addEventListener("click", nextSlide);

favoriteSection.addEventListener("mouseenter", () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  if (progressInterval) clearInterval(progressInterval);
});
favoriteSection.addEventListener("mouseleave", startAutoSlide);

fetchSlides();
