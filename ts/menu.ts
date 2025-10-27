interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  discountPrice: string;
}
interface CartItem extends Product {
  quantity: number;
}

// --- HTML elementlar ---
const wrapper = document.querySelector(".offer___card__wrapper") as HTMLElement;
const menuButtons = document.querySelectorAll(
  ".offer__menu"
) as NodeListOf<HTMLButtonElement>;
const loadMoreBtn = document.querySelector(".load-more") as HTMLButtonElement;

const loaderMenu = document.getElementById("loader") as HTMLElement;
const errorBoxMenu = document.getElementById("error") as HTMLElement;
const menuContainer = document.querySelector<HTMLDivElement>(".offer")!;

// --- Modal elementlari ---
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
const closeModalButton = document.querySelector(
  ".modal__close-button"
) as HTMLElement;

// --- Modal loader overlay ---
const modalLoader = document.createElement("div");
modalLoader.className = "modal-loader-overlay menu__error--hidden";
modalLoader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(modalLoader);

// --- Error notification ---
const notification = document.createElement("div");
notification.className = "error-notification hidden";
notification.textContent = "⚠️ Something went wrong. Please, try again.";
document.body.appendChild(notification);

// --- Dastur holatlari ---
let products: Product[] = [];
let activeCategory: string = "coffee";

// --- Backenddan mahsulotlarni yuklash ---
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
    products = Array.isArray(json.data) ? json.data : [];

    updateLayout();

    loaderMenu.classList.add("menu__error--hidden");
    menuContainer.classList.remove("menu__error--hidden");
  } catch (err) {
    console.error("❌ Error:", err);

    // loader yo‘qoladi
    loaderMenu.classList.add("menu__error--hidden");
    menuContainer.classList.remove("menu__error--hidden");

    // Notification ko‘rsatish
    showErrorNotification();
  }
}

// --- Error notification funksiyasi ---
function showErrorNotification(): void {
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 4000); // 4 sekunddan keyin yo‘qoladi
}

// --- Kategoriya bo‘yicha mahsulotlarni chiqarish ---
function renderProducts(category: string): void {
  wrapper.innerHTML = "";
  const filtered = products.filter((p) => p.category === category);
  const width = window.innerWidth;
  const count = width <= 768 ? 4 : 8;

  filtered.slice(0, count).forEach((item, id) => createProductCard(item, id));

  loadMoreBtn.style.display =
    width <= 768 && filtered.length > 4 ? "block" : "none";
}

// --- Ekran o‘lchami o‘zgarganda ---
window.addEventListener("resize", updateLayout);
function updateLayout(): void {
  renderProducts(activeCategory);
}

// --- "Load More" bosilganda ---
loadMoreBtn.addEventListener("click", () => {
  const filtered = products.filter((p) => p.category === activeCategory);
  filtered.slice(4).forEach((item, id) => createProductCard(item, id));
  loadMoreBtn.style.display = "none";
});

// --- Kategoriya tugmalari ---
menuButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuButtons.forEach((b) => b.classList.remove("offer__menu-active"));
    btn.classList.add("offer__menu-active");
    activeCategory = btn.dataset.category || "coffee";
    renderProducts(activeCategory);
  });
});

// --- Karta yaratish ---
function createProductCard(item: Product, id: number): void {
  const card = document.createElement("article");
  card.className = "offer__card";
  const imgSrc = `./images/${item.category}-${id + 1}.png`;

  card.innerHTML = `
    <img class="offer__card__image" src="${imgSrc}" alt="${item.name}" />
    <div class="offer__card__about">
      <h3 class="offer__card__title">${item.name}</h3>
      <p class="offer__card__text">${item.description}</p>
      <strong class="offer__card__price">$${item.price}</strong>
    </div>
  `;
  wrapper.appendChild(card);

  // --- Modalni ochishdan oldin loader ko‘rsatish ---
  card.addEventListener("click", async () => {
    modalLoader.classList.remove("menu__error--hidden");
    document.body.style.overflow = "hidden";

    try {
      const res = await fetch(
        `http://coffee-shop-be.eu-central-1.elasticbeanstalk.com/products/${item.id}`
      );
      if (!res.ok) throw new Error("Product details not found");

      const detail = await res.json();

      setTimeout(() => {
        modalLoader.classList.add("menu__error--hidden");
        showModal(detail.data || detail, imgSrc);
      }, 500);
    } catch (err) {
      modalLoader.classList.add("menu__error--hidden");
      document.body.style.overflow = "auto";
      showErrorNotification();
    }
  });
}

// --- Modal oynani ko‘rsatish ---
function showModal(product: Product, imgSrc: string): void {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;
  modalImg.src = imgSrc;

  updateModalPrice(product.price);
  // Eski eventlarni tozalash
  closeModal.replaceWith(closeModal.cloneNode(true));
  const newAddBtn = document.getElementById("closeModal") as HTMLElement;

  newAddBtn.addEventListener("click", () => {
    addToCartLocal(product);
    closeModalFunc();
  });
}

// --- Narx hisoblash ---
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

// --- Modal yopish ---
closeModal.addEventListener("click", closeModalFunc);
closeModalButton.addEventListener("click", closeModalFunc);
window.addEventListener("click", (e: MouseEvent) => {
  if (e.target === modal) closeModalFunc();
});

function closeModalFunc(): void {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}
// ❌ ESC tugmasi bosilganda
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") closeModalFunc();
});

// --- LocalStorage'dagi savatchani olish ---
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

// --- LocalStorage'ga saqlash ---
function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Mahsulotni savatchaga qo‘shish ---
function addToCartLocal(product: Product): void {
  let cart = getCart();

  const existingIndex = cart.findIndex((p) => p.id === product.id);

  if (existingIndex !== -1) {
    // Agar mahsulot allaqachon mavjud bo‘lsa — quantity ni oshiramiz
    cart[existingIndex].quantity += 1;
  } else {
    // Yangi mahsulot sifatida qo‘shamiz
    const newItem: CartItem = { ...product, quantity: 1 };
    cart.push(newItem);
  }

  saveCart(cart);
}

// --- Sahifa yuklanganda ---
window.addEventListener("DOMContentLoaded", loadProducts);
