function toggleFavorito(elemento) {
  const card = elemento.closest(".card");
  const nombre = card.querySelector("h3").textContent;

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (favoritos.includes(nombre)) {
    favoritos = favoritos.filter(fav => fav !== nombre);
    elemento.textContent = "🤍";
  } else {
    favoritos.push(nombre);
    elemento.textContent = "❤️";
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderFavoritos();
}

function renderFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const seccion = document.getElementById("misFavoritos");
  const grid = document.getElementById("gridFavoritos");

  if (!seccion || !grid) return;

  grid.innerHTML = "";

  if (favoritos.length === 0) {
    seccion.style.display = "none";
    return;
  }

  seccion.style.display = "block";

  document.querySelectorAll(".card").forEach(card => {
    const nombre = card.querySelector("h3").textContent;

    if (favoritos.includes(nombre)) {
      const clon = card.cloneNode(true);

      const botonAgregar = clon.querySelector(".agregar");
      if (botonAgregar) botonAgregar.remove();

      grid.appendChild(clon);
    }
  });
}