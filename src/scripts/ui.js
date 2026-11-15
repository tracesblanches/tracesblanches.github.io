// Two small helpers of the page; nothing is stored or sent.
// 1. The menu of the header (<details class="menu">, a phone): aria-expanded on its button,
//    Escape closes it and gives the focus back to the button, and it closes when the focus or a
//    click goes elsewhere. Without this script the <details> still opens and closes.
// 2. The pause button of the home slideshow: shown only with this script (it is the one that
//    makes it work), it toggles aria-pressed; the CSS pauses the cross-fade while it is pressed.
(function () {
  var menu = document.querySelector("details.menu");
  if (menu) {
    var button = menu.querySelector("summary");
    var sync = function () { button.setAttribute("aria-expanded", menu.open ? "true" : "false"); };
    var close = function (focus) { if (!menu.open) return; menu.open = false; sync(); if (focus) button.focus(); };
    sync();
    menu.addEventListener("toggle", sync);
    menu.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Esc") { e.preventDefault(); close(true); } });
    menu.addEventListener("focusout", function (e) { if (e.relatedTarget && !menu.contains(e.relatedTarget)) close(false); });
    document.addEventListener("click", function (e) { if (!menu.contains(e.target)) close(false); });
  }
  var pause = document.querySelector(".hero-play");
  if (pause) {
    pause.hidden = false;
    pause.addEventListener("click", function () {
      pause.setAttribute("aria-pressed", pause.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });
  }
})();
