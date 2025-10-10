const menuItems = document.querySelectorAll(".offer__menu");
const wrapper = document.querySelector(".offer___card__wrapper");
let allProducts = [];

// 🔹 1. Ma'lumotlarni yuklaymiz
fetch("./js/products.json")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data; // Saqlab qo‘yamiz
    renderProducts(allProducts.filter((p) => p.category === "coffee")); // Default: coffee
  })
  .catch((err) => console.error("JSON yuklashda xatolik:", err));

// 🔹 2. Render funksiyasi
function renderProducts(products) {
  console.log(products);
  wrapper.innerHTML = ""; // Eski kartalarni tozalaymiz

  products.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "offer__card";

    card.innerHTML = `
      <img 
        class="offer__card__image" 
        src="././images/${item.category}-${index + 1}.png"" 
        alt="${item.name}"
      />
      <div class="offer__card__about">
        <h3 class="offer__card__title">${item.name}</h3>
        <p class="offer__card__text">${item.description}</p>
        <strong class="offer__card__price">$${item.price}</strong>
      </div>
    `;

    wrapper.appendChild(card);
  });
}

// 🔹 3. Menyuga click hodisasi
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Aktiv holatlarni olib tashlash
    document
      .querySelector(".offer__menu-active")
      ?.classList.remove("offer__menu-active");
    document
      .querySelector(".offer__menu__image-active")
      ?.classList.remove("offer__menu__image-active");
    document
      .querySelector(".offer__menu__text-active")
      ?.classList.remove("offer__menu__text-active");

    // Bosilgan elementni aktiv qilish
    item.classList.add("offer__menu-active");
    item
      .querySelector(".offer__menu__image")
      .classList.add("offer__menu__image-active");
    item.querySelector("span").classList.add("offer__menu__text-active");

    // 🔹 Toifani aniqlaymiz (Coffee, Tea, Dessert)
    const category = item
      .querySelector("span")
      .textContent.toLowerCase()
      .trim();

    // 🔹 filter orqali faqat shu toifani chiqaramiz
    const filtered = allProducts.filter((p) => p.category === category);
    renderProducts(filtered);
  });
});

// Modal screen
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");
