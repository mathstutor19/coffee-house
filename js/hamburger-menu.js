const menuBtn = document.getElementById("menu-btn");
const burgerMenu = document.getElementById("mobile__menu");
const links = burgerMenu.querySelectorAll(".mobile__nav__link");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  burgerMenu.classList.toggle("active");
});

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active");
  burgerMenu.classList.toggle("active");
});

burgerMenu.addEventListener("click", () => {
  burgerBtn.classList.remove("active");
  burgerMenu.classList.remove("active");
});
// Link bosilganda menyuni yopish
links.forEach((link) => {
  link.addEventListener("click", () => {
    burgerBtn.classList.remove("active");
    burgerMenu.classList.remove("active");
  });
});
