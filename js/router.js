const routes = {
  accueil: "accueil.html",
  magie: "magie.html",
  chronologie: "chronologie.html",
  race: "race.html",
  unite: "unité.html",
  creation: "creation-personnage.html"
};

const app = document.querySelector("#app");

let styleContainer = document.querySelector("#page-styles");

if (!styleContainer) {
  styleContainer = document.createElement("div");
  styleContainer.id = "page-styles";
  document.head.appendChild(styleContainer);
}

function getRoute() {
  return location.hash.replace("#/", "") || "accueil";
}

function setActiveLink(route) {
  document.querySelectorAll("[data-route]").forEach(link => {
    link.classList.toggle("active", link.dataset.route === route);
  });
}

function executePageScripts(container) {
  container.querySelectorAll("script").forEach(oldScript => {
    const newScript = document.createElement("script");

    [...oldScript.attributes].forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });

    newScript.textContent = oldScript.textContent;
    oldScript.replaceWith(newScript);
  });
}
function convertInternalLinks(container) {
  const aliases = {
    "index.html": "accueil",
    "accueil.html": "accueil",
    "magie.html": "magie",
    "chronologie.html": "chronologie",
    "race.html": "race",
    "unité.html": "unite",
    "unite.html": "unite",
    "creation-personnage.html": "creation"
  };

  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if (!href) return;
    if (href.startsWith("http")) return;
    if (href.startsWith("mailto:")) return;
    if (href.startsWith("#")) return;

    const page = href.split("#")[0];
    const anchor = href.includes("#") ? "#" + href.split("#")[1] : "";

    if (aliases[page]) {
      link.setAttribute("href", "#/" + aliases[page] + anchor);
    }
  });
}
async function loadRoute(route) {
  const file = routes[route] || routes.accueil;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Page introuvable : " + file);
    }

    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    styleContainer.innerHTML = "";

    doc.head.querySelectorAll("style, link[rel='stylesheet']").forEach(style => {
      styleContainer.appendChild(style.cloneNode(true));
    });

    app.innerHTML = doc.body.innerHTML;

    executePageScripts(app);
    setActiveLink(route);

    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);

    app.innerHTML = `
      <section style="padding:40px;color:white;font-family:Arial,sans-serif;">
        <h1>Erreur</h1>
        <p>${error.message}</p>
      </section>
    `;
  }
}

window.addEventListener("hashchange", () => {
  loadRoute(getRoute());
});

document.addEventListener("DOMContentLoaded", () => {
  loadRoute(getRoute());
});
