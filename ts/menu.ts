interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  discountPrice: string;
}

const wrapper = document.querySelector(".offer___card__wrapper") as HTMLElement;
const menuButtons = document.querySelectorAll(
  ".offer__menu"
) as NodeListOf<HTMLButtonElement>;
const loadMoreBtn = document.querySelector(".load-more") as HTMLButtonElement;

const loaderMenu = document.getElementById("loader") as HTMLElement;
const errorBoxMenu = document.getElementById("error") as HTMLElement;
const menuContainer = document.querySelector<HTMLDivElement>(".offer")!;
// Modal elementlari
const modal = document.getElementById("productModal") as HTMLElement;
const modalTitle = document.getElementById("modalTitle") as HTMLElement;
const modalDesc = document.getElementById("modalDesc") as HTMLElement;
const modalImg = document.getElementById("modalImg") as HTMLImageElement;
const finalPrice = document.getElementById("finalPrice") as HTMLElement;
const sizeRadios = document.querySelectorAll(
  'input[name="size"]'
) as NodeListOf<HTMLInputElement>;
const additiveCheckboxes = document.querySelectorAll(
  ".additive"
) as NodeListOf<HTMLInputElement>;
const closeModal = document.getElementById("closeModal") as HTMLElement;

let products: Product[] = [];
let activeCategory: string = "coffee";
let visibleCount: number = 8;

async function loadProducts(): Promise<void> {
  try {
    loaderMenu.classList.remove("menu__error--hidden");
    errorBoxMenu.classList.add("menu__error--hidden");
    menuContainer.classList.add("menu__error--hidden");

    const res = await fetch(
      "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products"
    );
    if (!res.ok) throw new Error("Network error");

    const json = await res.json();
    products = Array.isArray(json) ? json : json.data ?? [];
    console.log(products);
    // slides = result.data; // ✅ Faqat data massivini olamiz
    updateLayout();
    loaderMenu.classList.add("menu__error--hidden");
    menuContainer.classList.remove("menu__error--hidden");
  } catch (err) {
    console.error("❌ Error:", err);
    loaderMenu.classList.add("menu__error--hidden");
    errorBoxMenu.textContent =
      "Something went wrong. Please, refresh the page.";
    errorBoxMenu.classList.remove("menu__error--hidden");
  }
}

// JSON faylni yuklash
// async function loadProducts(): Promise<void> {
//   const res = await fetch("./js/products.json");
//   products = await res.json();
//   updateLayout();
// }

// Kategoriya bo‘yicha mahsulotlarni chiqarish
function renderProducts(category: string): void {
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

// Kategoriya tugmasini bosganda
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("offer__menu-active"));
    btn.classList.add("offer__menu-active");
    activeCategory = btn.dataset.category || "coffee";
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

function updateLayout(): void {
  renderProducts(activeCategory);
}

// Sahifa yuklanganda
window.addEventListener("DOMContentLoaded", loadProducts);

// JSON faylni yuklash
async function loadProductsAgain(): Promise<void> {
  const res = await fetch("./js/products.json");
  products = await res.json();
  renderProducts(activeCategory);
}

// Dinamik card yaratish
function createProductCard(item: Product, id: number): void {
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
    const sizeInput = document.querySelector(
      'input[name="size"][value="S"]'
    ) as HTMLInputElement;
    if (sizeInput) sizeInput.checked = true;
    additiveCheckboxes.forEach((cb) => (cb.checked = false));

    updateModalPrice(item.price);
  });
}

// Narxni hisoblash funksiyasi
function updateModalPrice(basePrice: string): void {
  function calculate(): void {
    const sizeInput = document.querySelector(
      'input[name="size"]:checked'
    ) as HTMLInputElement;
    const sizePrice = parseFloat(sizeInput?.dataset.price || "0");
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

// Menu tugmalari
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("offer__menu-active"));
    btn.classList.add("offer__menu-active");
    activeCategory = btn.dataset.category || "coffee";
    renderProducts(activeCategory);
  });
});

// Modal yopish
closeModal.addEventListener("click", closeModalFunc);
window.addEventListener("click", (e: MouseEvent) => {
  if (e.target === modal) closeModalFunc();
});

function closeModalFunc(): void {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // scrollni tiklash
}

// DOMContentLoaded
window.addEventListener("DOMContentLoaded", loadProducts);
