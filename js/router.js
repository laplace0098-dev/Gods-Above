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

    document.querySelectorAll("[data-route]").forEach(link => {
      link.classList.toggle("active", link.dataset.route === route);
    });

    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section style="padding:40px;color:white;">
        <h1>Erreur</h1>
        <p>${error.message}</p>
      </section>
    `;
  }
}

function getRoute() {
  return location.hash.replace("#/", "") || "accueil";
}

window.addEventListener("hashchange", () => {
  loadRoute(getRoute());
});

document.addEventListener("DOMContentLoaded", () => {
  loadRoute(getRoute());
});
