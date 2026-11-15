// Root page only. A choice made with the FR | EN switch (lang-memory.js) wins. Without one, a visitor
// arriving from outside the site whose browser prefers French over English opens /fr/; a
// visitor coming from another page of the site stays (with storage blocked, the EN link
// must not bounce back to /fr/). Without JavaScript, English stays.
(function () {
  var saved = null, inside = false;
  try { saved = localStorage.getItem("lang"); } catch (e) { /* storage disabled */ }
  try { inside = new URL(document.referrer).origin === location.origin; } catch (e) { /* no referrer */ }
  var fr = saved === "fr";
  if (saved !== "fr" && saved !== "en" && !inside) {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).toLowerCase().slice(0, 2);
      if (l === "fr") { fr = true; break; }
      if (l === "en") break;
    }
  }
  if (fr) location.replace("fr/" + location.hash);
})();
