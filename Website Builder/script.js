// =========================
// PAGE LOADER
// =========================

const pageLoader = document.getElementById("pageLoader");

setTimeout(function () {
    pageLoader.remove();
}, 1000);


// =========================
// MOBILE MENU
// =========================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
    navLinks.classList.toggle("show");
});