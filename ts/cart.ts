// 💡 Cart ma'lumotlari LocalStorage'da "cart" nomi bilan saqlanadi
// 💡 Foydalanuvchi tizimga kirgan deb faraz qilamiz (true/false)
const isLoggedIn = false;

// Elementlarni olish
const cartLink = document.getElementById("cartLink") as HTMLElement;
const cartCount = document.getElementById("cartCount") as HTMLElement;

// LocalStorage'dan ma'lumot olish yoki bo'sh array yaratish
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Funksiya: Savatcha sonini yangilash
function updateCartDisplay() {
  const itemCount = cart.length;
  cartCount.textContent = String(itemCount);

  // Agar user login bo‘lsa — har doim ko‘rsatiladi
  // Agar login bo‘lmasa — faqat 1 ta itemdan keyin ko‘rsatiladi
  if (isLoggedIn || itemCount > 0) {
    cartLink.classList.remove("hidden");
  } else {
    cartLink.classList.add("hidden");
  }
}

// Funksiya: Mahsulot qo‘shish
function addToCart(product: { id: number; name: string; price: number }) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// Funksiya: Savatchani tozalash
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartDisplay();
}

// ✅ Sahifa yuklanganda — mavjud savatchani ko‘rsatish
updateCartDisplay();

// 💡 Test uchun: Konsoldan sinab ko‘rish mumkin
// addToCart({ id: 1, name: "Latte", price: 5 });
// clearCart();
