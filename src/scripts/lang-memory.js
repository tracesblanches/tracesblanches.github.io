// Remembers the language picked with the FR | EN switch of the header. The home page at the
// root reads this choice before the browser's languages (lang-root.js). Nothing leaves the browser.
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a[data-lang]");
  if (!a) return;
  try { localStorage.setItem("lang", a.getAttribute("data-lang")); } catch (err) { /* storage disabled */ }
});
