const toggleBtn = document.getElementById("theme-toggle");
const htmlEl = document.documentElement;

toggleBtn.addEventListener("click", () => {
  htmlEl.classList.toggle("dark");
  if (htmlEl.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Load theme from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    htmlEl.classList.toggle("dark", savedTheme === "dark");
  }
});
