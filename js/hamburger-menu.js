const burgerBtn = document.getElementById("menu-btn"); // faqat bitta tugma
const burgerMenu = document.getElementById("mobile__menu");
const links = document.querySelectorAll(".nav__mobile__link");

// Burger tugmasi bosilganda menyuni och/yop
burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active");
  burgerMenu.classList.toggle("active");
});

// Menyudagi link bosilganda menyuni yop
links.forEach((link) => {
  link.addEventListener("click", () => {
    burgerBtn.classList.remove("active");
    burgerMenu.classList.remove("active");
  });
});
