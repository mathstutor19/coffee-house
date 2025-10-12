const wrapper = document.querySelector(".offer___card__wrapper");
const menuButtons = document.querySelectorAll(".offer__menu");
const loadMoreBtn = document.querySelector(".load-more");

let products = [];
let activeCategory = "coffee";
let visibleCount = 8;

// JSON faylni yuklash
async function loadProducts() {
  const res = await fetch("./js/products.json");
  products = await res.json();
  updateLayout();
}

// Kategoriya bo‘yicha mahsulotlarni chiqarish
function renderProducts(category) {
  wrapper.innerHTML = "";
  const filtered = products.filter((p) => p.category === category);
  const width = window.innerWidth;
  const count = width <= 768 ? 4 : 8;

  filtered.slice(0, count).forEach((item, id) => createProductCard(item, id));

  // Load More ko‘rsatish
  if (width <= 768 && filtered.length > 4) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

// Har bir mahsulot kartasini yaratish
function createProductCard(item, id) {
  const card = document.createElement("article");
  card.className = "offer__card";
  card.innerHTML = `
    <img class="offer__card__image" src="./images/${item.category}-${
    id + 1
  }.png" alt="${item.name}" />
    <div class="offer__card__about">
      <h3 class="offer__card__title">${item.name}</h3>
      <p class="offer__card__text">${item.description}</p>
      <strong class="offer__card__price">$${item.price}</strong>
    </div>
  `;
  wrapper.appendChild(card);
}

// Kategoriya tugmasini bosganda
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("offer__menu-active"));
    btn.classList.add("offer__menu-active");
    activeCategory = btn.dataset.category;
    renderProducts(activeCategory);
  });
});

// Load More bosilganda
loadMoreBtn.addEventListener("click", () => {
  const filtered = products.filter((p) => p.category === activeCategory);
  filtered.slice(4).forEach((item, id) => createProductCard(item, id));
  loadMoreBtn.style.display = "none";
});

// Ekran o‘lchami o‘zgarsa
window.addEventListener("resize", updateLayout);

function updateLayout() {
  renderProducts(activeCategory);
}

// Sahifa yuklanganda
window.addEventListener("DOMContentLoaded", loadProducts);
