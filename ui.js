// ======================
// MODO OSCURO
// ======================

function toggleModo() {
  document.body.classList.toggle("dark");

  const modoActual = document.body.classList.contains("dark");
  localStorage.setItem("modoOscuro", modoActual);

  actualizarIconoModo();
}

function iniciarModoOscuro() {
  const modoGuardado = localStorage.getItem("modoOscuro");

  if (modoGuardado === "true") {
    document.body.classList.add("dark");
  }

  actualizarIconoModo();
}

function actualizarIconoModo() {
  const icono = document.getElementById("iconoModo");
  if (!icono) return;

  if (document.body.classList.contains("dark")) {
    icono.textContent = "☀";
  } else {
    icono.textContent = "🌙";
  }
}

// ======================
// NOTIFICACIÓN
// ======================

function mostrarNotificacion() {
  const noti = document.getElementById("notificacion");
  if (!noti) return;

  noti.classList.add("mostrar");

  setTimeout(() => {
    noti.classList.remove("mostrar");
  }, 2000);
}

// ======================
// ANIMACIÓN CARRITO
// ======================

function animarCarrito() {
  const carritoIcono = document.querySelector(".carrito");
  if (!carritoIcono) return;

  carritoIcono.classList.add("animar");

  setTimeout(() => {
    carritoIcono.classList.remove("animar");
  }, 300);
}

// ======================
// FILTRO
// ======================

function filtrar(categoria) {
  const productos = document.querySelectorAll(".card");

  productos.forEach(producto => {
    if (categoria === "todos" || producto.dataset.categoria === categoria) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
}

// ======================
// BUSCADOR
// ======================

function iniciarBuscador() {
  const buscador = document.getElementById("buscador");
  if (!buscador) return;

  buscador.addEventListener("input", () => {
    const valor = buscador.value.toLowerCase();
    const productos = document.querySelectorAll(".card");

    productos.forEach(producto => {
      const nombre = producto.querySelector("h3").textContent.toLowerCase();

      if (nombre.includes(valor)) {
        producto.style.display = "block";
      } else {
        producto.style.display = "none";
      }
    });
  });
}

// ======================
// TOGGLE PANEL CARRITO
// ======================

function iniciarToggleCarrito() {
  const carritoIcono = document.querySelector(".carrito");
  const carritoPanel = document.getElementById("carritoPanel");

  if (!carritoIcono || !carritoPanel) return;

  carritoIcono.addEventListener("click", () => {
    carritoPanel.classList.toggle("mostrar");
  });
}

// JS para abrir/cerrar
function toggleCarrito() {

  const panel = document.getElementById("carritoPanel");
  const overlay = document.getElementById("overlayCarrito");

  panel.classList.toggle("activo");
  overlay.classList.toggle("activo");
}

// Cerrar si clickea overlay
document.getElementById("overlayCarrito")?.addEventListener("click", toggleCarrito);