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
// function createProductCard(item, id) {
//   const card = document.createElement("article");
//   card.className = "offer__card";
//   card.innerHTML = `
//     <img class="offer__card__image" src="./images/${item.category}-${
//     id + 1
//   }.png" alt="${item.name}" />
//     <div class="offer__card__about">
//       <h3 class="offer__card__title">${item.name}</h3>
//       <p class="offer__card__text">${item.description}</p>
//       <strong class="offer__card__price">$${item.price}</strong>
//     </div>
//   `;
//   wrapper.appendChild(card);
// }

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

// modal
// const wrapper = document.querySelector(".offer___card__wrapper");
// const menuButtons = document.querySelectorAll(".offer__menu");
// const loadMoreBtn = document.querySelector(".load-more");

// let products = [];
// let activeCategory = "coffee";

// Modal elementlari
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");
const finalPrice = document.getElementById("finalPrice");
const sizeRadios = document.querySelectorAll('input[name="size"]');
const additiveCheckboxes = document.querySelectorAll(".additive");
const closeModal = document.getElementById("closeModal");

// JSON faylni yuklash
async function loadProducts() {
  const res = await fetch("./js/products.json");
  products = await res.json();
  renderProducts(activeCategory);
}

// Dinamik card yaratish
function createProductCard(item, id) {
  const card = document.createElement("article");
  card.className = "offer__card";

  // Data atributlari modal uchun
  card.dataset.name = item.name;
  card.dataset.desc = item.description;
  card.dataset.price = item.price;
  card.dataset.img = `./images/${item.category}-${id + 1}.png`;

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

  // --- Modal ochish ---
  card.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // scrollni o'chirish
    modalTitle.textContent = item.name;
    modalDesc.textContent = item.description;
    modalImg.src = `./images/${item.category}-${id + 1}.png`;

    // Reset selections
    document.querySelector('input[name="size"][value="S"]').checked = true;
    additiveCheckboxes.forEach((cb) => (cb.checked = false));

    updateModalPrice(item.price);
  });
}

// Narxni hisoblash funksiyasi
function updateModalPrice(basePrice) {
  function calculate() {
    const sizePrice = parseFloat(
      document.querySelector('input[name="size"]:checked').dataset.price
    );
    let additivesPrice = 0;
    additiveCheckboxes.forEach((cb) => {
      if (cb.checked) additivesPrice += 0.5;
    });
    finalPrice.textContent = (
      parseFloat(basePrice) +
      sizePrice +
      additivesPrice
    ).toFixed(2);
  }
  sizeRadios.forEach((r) => r.addEventListener("change", calculate));
  additiveCheckboxes.forEach((cb) => cb.addEventListener("change", calculate));
  calculate();
}

// Render products
// function renderProducts(category) {
//   wrapper.innerHTML = "";
//   const filtered = products.filter((p) => p.category === category);
//   filtered.forEach((item, id) => createProductCard(item, id));
// }

// Menu tugmalari
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("offer__menu-active"));
    btn.classList.add("offer__menu-active");
    activeCategory = btn.dataset.category;
    renderProducts(activeCategory);
  });
});

// Modal yopish
closeModal.addEventListener("click", closeModalFunc);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFunc();
});
function closeModalFunc() {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // scrollni tiklash
}

// DOMContentLoaded
window.addEventListener("DOMContentLoaded", loadProducts);
