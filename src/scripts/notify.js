// The "Get notified of the release" form (src/components/Notify.astro). The buttons of the page
// that lead to it (#notify) bring the focus to its address field. When the form is first used,
// the invisible Cloudflare Turnstile script is loaded; on sending: checks of the fields, the
// Turnstile check, then a form POST to the server. Nothing is stored in the browser.
(function () {
  var form = document.getElementById("notify-form");
  if (!form) return;
  var msg = JSON.parse(form.getAttribute("data-messages") || "{}");
  var email = form.elements.namedItem("email");
  var consent = form.elements.namedItem("consent");
  var status = document.getElementById("notify-status");
  var button = form.querySelector("button[type=submit]");
  form.hidden = false;

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#notify"]');
    if (!a || a.pathname !== location.pathname) return;
    e.preventDefault();
    var menu = document.querySelector("details.menu");
    if (menu) menu.open = false;
    email.focus();
    history.replaceState(null, "", "#notify");
  });

  var scriptP = null;
  var loadTurnstile = function () {
    if (!scriptP) scriptP = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = form.getAttribute("data-script");
      s.async = true;
      s.onload = function () { window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")); };
      s.onerror = function () { scriptP = null; reject(new Error("turnstile")); };
      document.head.appendChild(s);
    });
    return scriptP;
  };
  form.addEventListener("focusin", function () { loadTurnstile().catch(function () {}); }, { once: true });

  var widget = null;
  var waiting = null;
  var token = function () {
    return loadTurnstile().then(function (ts) {
      return new Promise(function (resolve) {
        var timer = setTimeout(function () { waiting = null; resolve(null); }, 30000);
        waiting = function (t) { clearTimeout(timer); waiting = null; resolve(t); };
        if (widget === null) {
          widget = ts.render(document.getElementById("notify-ts"), {
            sitekey: form.getAttribute("data-sitekey"),
            execution: "execute",
            appearance: "interaction-only",
            action: "notify",
            language: document.documentElement.lang,
            callback: function (t) { if (waiting) waiting(t); },
            "error-callback": function () { if (waiting) waiting(null); return true; },
            "expired-callback": function () {},
          });
        }
        ts.execute(widget);
      });
    });
  };

  var setError = function (el, text) {
    el.setAttribute("aria-invalid", text ? "true" : "false");
    document.getElementById(el.id + "-error").textContent = text;
  };
  var check = function () {
    var okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()) && email.value.trim().length <= 254;
    setError(email, okEmail ? "" : msg.email);
    setError(consent, consent.checked ? "" : msg.consent);
    if (!okEmail) { email.focus(); return false; }
    if (!consent.checked) { consent.focus(); return false; }
    return true;
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "notify-status";
    status.textContent = "";
    if (!check()) return;
    button.disabled = true;
    status.textContent = msg.check;
    token().catch(function () { return null; }).then(function (t) {
      if (!t) throw new Error("turnstile");
      status.textContent = msg.sending;
      var body = new URLSearchParams();
      body.set("email", email.value.trim());
      body.set("lang", form.elements.namedItem("lang").value);
      body.set("consent", "on");
      body.set("website", form.elements.namedItem("website").value);
      body.set("cf-turnstile-response", t);
      return fetch(form.getAttribute("action"), { method: "POST", body: body, headers: { accept: "application/json" } })
        .catch(function () { throw new Error("network"); })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (b) {
            if (!res.ok || !b.ok) throw new Error(b.error || "server");
            return b;
          });
        });
    }).then(function (b) {
      form.reset();
      status.className = "notify-status done";
      status.textContent = msg.done + " ";
      if (b.unsubscribe) {
        var a = document.createElement("a");
        a.href = b.unsubscribe;
        a.textContent = msg.unsubscribe;
        status.appendChild(a);
      }
    }, function (err) {
      var code = err.message;
      status.className = "notify-status error";
      status.textContent = msg[code] || msg.server;
      if (code === "invalid_email") email.focus();
      if (code === "consent_required") consent.focus();
      if (window.turnstile && widget !== null) window.turnstile.reset(widget);
    }).then(function () { button.disabled = false; });
  });
})();
