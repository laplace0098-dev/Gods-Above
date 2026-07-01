
(() => {
  const frame = document.getElementById("ga-frame");
  const navLinks = document.querySelectorAll("[data-route]");
  const title = document.getElementById("ga-current-page");

  const routes = {
    "index": "pages/index.html",
    "accueil": "pages/index.html",
    "chronologie": "pages/chronologie.html",
    "magie": "pages/magie.html",
    "race": "pages/race.html",
    "unité": "pages/unité.html",
    "unite": "pages/unité.html",
    "creation-personnage": "pages/creation-personnage.html",
    "monde": "pages/monde.html",
    "personnages": "pages/personnages.html"
  };

  const labels = {
    index: "Accueil",
    accueil: "Accueil",
    chronologie: "Chronologie",
    magie: "Magie",
    race: "Races",
    unité: "Unités",
    unite: "Unités",
    "creation-personnage": "Création",
    monde: "Monde",
    personnages: "Personnages"
  };

  function normalize(route) {
    route = (route || location.hash.replace(/^#\/?/, "") || "index").trim();
    route = route.replace(/\.html$/i, "");
    if (route === "") route = "index";
    return route;
  }

  function setActive(route) {
    navLinks.forEach(a => a.classList.toggle("active", a.dataset.route === route || (route === "unite" && a.dataset.route === "unité")));
    title.textContent = labels[route] || route;
  }

  function go(route, replace = false) {
    route = normalize(route);
    const src = routes[route] || routes.index;
    setActive(route);
    frame.src = src;
    const hash = "#/" + route;
    if (location.hash !== hash) {
      if (replace) history.replaceState(null, "", hash);
      else history.pushState(null, "", hash);
    }
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-route]");
    if (!link) return;
    event.preventDefault();
    go(link.dataset.route);
  });

  window.addEventListener("hashchange", () => go(normalize(), true));

  frame.addEventListener("load", () => {
    try {
      const url = new URL(frame.contentWindow.location.href);
      const file = url.pathname.split("/").pop() || "index.html";
      const route = normalize(file);
      if (routes[route] && location.hash !== "#/" + route) {
        history.replaceState(null, "", "#/" + route);
        setActive(route);
      }
    } catch (err) {
      // Ignore si le navigateur bloque l'accès.
    }
  });

  go(normalize(), true);
})();
