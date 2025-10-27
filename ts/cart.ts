// 💡 Foydalanuvchi tizimga kirgan yoki yo‘qligini belgilaymiz
const isLoggedIn: boolean = false;

// 🛒 Mahsulot turi (type)
type CartItemStore = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

// HTML elementlar
const cartLink = document.getElementById("cartLink") as HTMLElement;
const cartCount = document.getElementById("cartCount") as HTMLElement;

// LocalStorage'dan savatni olish
let cart: CartItemStore[] = JSON.parse(localStorage.getItem("cart") || "[]");

// 🔄 Savatchani yangilovchi funksiya
function updateCartDisplay(): void {
  const itemCount: number = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  cartCount.textContent = String(itemCount);

  if (isLoggedIn || itemCount > 0) {
    cartLink.classList.remove("hidden");
  } else {
    cartLink.classList.add("hidden");
  }
}

// ➕ Mahsulot qo‘shish funksiyasi
function addToCart(product: { id: number; name: string; price: number }): void {
  // LocalStorage'dan yangilab olamiz
  cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const exists: CartItemStore | undefined = cart.find(
    (item: CartItemStore) => item.id === product.id
  );

  if (exists) {
    exists.quantity = (exists.quantity || 1) + 1;
  } else {
    const newItem: CartItemStore = { ...product, quantity: 1 };
    cart.push(newItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// 🗑 Savatni tozalash funksiyasi
function clearCart(): void {
  cart = [];
  localStorage.removeItem("cart");
  updateCartDisplay();
}

// 🚀 Sahifa yuklanganda
window.addEventListener("DOMContentLoaded", (): void => {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCartDisplay();
});

// 🕒 Storage o‘zgarganda real-time yangilanish
window.addEventListener("storage", (e: StorageEvent): void => {
  if (e.key === "cart") {
    cart = JSON.parse(localStorage.getItem("cart") || "[]");
    updateCartDisplay();
  }
});
