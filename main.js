// ===============================
// ESTADO GLOBAL PRODUCTOS
// ===============================

let productosGlobal = [];
let seleccionColor = null;
let seleccionTalle = null;
let cantidadSeleccionada = 1;

// ===============================
// OBTENER PRODUCTOS (JSON EXTERNO)
// ===============================

async function obtenerProductos() {
  const response = await fetch("productos.json");
  const data = await response.json();
  return data;
}


// ===============================
// RENDER PRODUCTOS
// ===============================

async function renderProductos() {
  const grid = document.getElementById("gridProductos");
  if (!grid) return;

    grid.innerHTML = "<p>Cargando productos...</p>";

  productosGlobal = await obtenerProductos();

  pintarProductos(productosGlobal);
}

function pintarProductos(lista) {
  const grid = document.getElementById("gridProductos");
  if (!grid) return;

  grid.innerHTML = "";

  lista.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-categoria", producto.categoria);

  card.innerHTML = `
  <div class="favorito" onclick="toggleFavorito(this)">🤍</div>
  <img src="${producto.imagen}" alt="${producto.nombre}">
  <h3>${producto.nombre}</h3>
  <p>$${producto.precio}</p>
  <button class="agregar"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}">
    Agregar al carrito
  </button>
`;

card.addEventListener("click", (e) => {
  if (!e.target.classList.contains("agregar") &&
      !e.target.classList.contains("favorito")) {
    navegar(`/producto/${producto.id}`);
  }
})

    grid.appendChild(card);
  });
}


// ===============================
// ORDENAMIENTO
// ===============================

function iniciarOrdenamiento() {
  const select = document.getElementById("ordenar");
  if (!select) return;

  select.addEventListener("change", () => {

    let copia = [...productosGlobal];

    if (select.value === "menor") {
      copia.sort((a, b) => a.precio - b.precio);
    }

    if (select.value === "mayor") {
      copia.sort((a, b) => b.precio - a.precio);
    }

    pintarProductos(copia);
  });
}


// ===============================
// SISTEMA DE RUTAS (SPA)
// ===============================

function navegar(ruta) {
  window.history.pushState({}, "", ruta);
  router();
}

window.addEventListener("popstate", router);

async function router() {
  const ruta = window.location.pathname;

  if (productosGlobal.length === 0) {
    productosGlobal = await obtenerProductos();
  }

  if (ruta.startsWith("/producto/")) {
    const id = parseInt(ruta.split("/")[2]);
    renderDetalleProducto(id);

  } else if (ruta === "/checkout") {
    renderCheckout();

  } else {
    renderHome();
  }
}

// ===============================
// VISTA HOME
// ===============================

async function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    
    <!-- HERO -->
    <section class="hero">
      <h2>Nueva Colección 2026</h2>
      <p>Moda urbana que define tu estilo</p>
      <button onclick="window.scrollTo({ top: 700, behavior: 'smooth' })">
        Explorar ahora
      </button>
    </section>

    <!-- PRODUCTOS -->
    <section class="productos">
      <h2>Productos</h2>

      <div class="barra-controles">

        <!-- BUSCADOR -->
        <input 
          type="text" 
          id="buscador" 
          placeholder="Buscar producto..."
          class="buscador"
        />

        <!-- CATEGORÍAS -->
        <select id="categoria">
          <option value="todos">Todas las categorías</option>
          <option value="remera">Remeras</option>
          <option value="pantalon">Pantalones</option>
          <option value="buzo">Buzos</option>
        </select>

        <!-- ORDEN -->
        <select id="ordenar">
          <option value="">Ordenar por</option>
          <option value="menor">Precio menor</option>
          <option value="mayor">Precio mayor</option>
        </select>

      </div>

      <div class="grid" id="gridProductos"></div>
    </section>

    <!-- FAVORITOS -->
    <section id="misFavoritos" class="favoritos-seccion">
      <h2>❤️ Mis Favoritos</h2>
      <div class="grid" id="gridFavoritos"></div>
    </section>

    <!-- CONTACTO -->
    <section class="contacto">
      <h2>Contacto</h2>
      <p>Seguinos en nuestras redes o escribinos por WhatsApp</p>
      <button onclick="comprarWhatsApp()">Contactar</button>
    </section>

    <footer>
      <p>© 2026 UrbanStyle - Todos los derechos reservados</p>
    </footer>
  `;

  await renderProductos();
  renderFavoritos();
  iniciarOrdenamiento();
  iniciarBuscador();
  iniciarFiltroCategoria();
}

// ===============================
// VISTA CHECKOUT
// ===============================

function renderCheckout() {
  const app = document.getElementById("app");

  let total = 0;

  const lista = carrito.map(producto => {
    total += producto.precio * producto.cantidad;

    return `
      <div class="checkout-item">
        <div>
          <p class="checkout-nombre">${producto.nombre}</p>
          <p class="checkout-cantidad">
            ${producto.cantidad} x $${formatearPrecio(producto.precio)}
          </p>
        </div>
        <strong>
          $${formatearPrecio(producto.precio * producto.cantidad)}
        </strong>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <section class="checkout-container">

      <div class="checkout-resumen">
        <h2>Resumen de tu compra</h2>
        ${lista}
        <div class="checkout-total">
          Total: $${formatearPrecio(total)}
        </div>
      </div>

      <div class="checkout-formulario">
        <h2>Datos del comprador</h2>

        <input type="text" placeholder="Nombre completo">
        <input type="email" placeholder="Email">
        <input type="text" placeholder="Dirección">

        <button class="btn-confirmar" onclick="finalizarCompra()">
          Confirmar compra
        </button>

        <button class="btn-volver" onclick="navegar('/')">
          Volver
        </button>
      </div>

    </section>
  `;
}

// ==============================
// DELEGACIÓN DE EVENTOS
// ===============================

document.addEventListener("click", (e) => {

  if (e.target.classList.contains("agregar")) {
    const nombre = e.target.dataset.nombre;
    const precio = parseInt(e.target.dataset.precio);

    agregarAlCarrito(nombre, precio);
    mostrarNotificacion();
    animarCarrito();
  }

});


// ===============================
// INICIALIZACIÓN APP
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  await router();
  actualizarCarritoUI();
  iniciarModoOscuro();
  iniciarToggleCarrito();
});

// ===============================
// AGREGAR FILTRO POR CATEGORIA
// =============================== 
function iniciarFiltroCategoria() {
  const select = document.getElementById("categoria");
  if (!select) return;

  select.addEventListener("change", () => {
    aplicarFiltros();
  });
}

// ================================
// MEJORAR BUSCADOR PARA QUE TRABAJE CON FILTROS
// ================================
function iniciarBuscador() {
  const buscador = document.getElementById("buscador");
  if (!buscador) return;

  buscador.addEventListener("input", () => {
    aplicarFiltros();
  });
}


// ===================================
// FUNCION CENTRAL APLICAR FILTROS()
// ===================================
function aplicarFiltros() {
  const texto = document.getElementById("buscador")?.value.toLowerCase() || "";
  const categoria = document.getElementById("categoria")?.value || "todos";

  let resultado = [...productosGlobal];

  // Filtrar por categoría
  if (categoria !== "todos") {
    resultado = resultado.filter(p => p.categoria === categoria);
  }

  // Filtrar por texto
  if (texto) {
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  pintarProductos(resultado);
}


// VISTA DETALLE
function renderDetalleProducto(id) {

  const app = document.getElementById("app");
  const producto = productosGlobal.find(p => p.id === id);
  if (!producto) return;

  seleccionColor = null;
  seleccionTalle = null;

  // Resetear selección cada vez que se entra
  app.innerHTML = `
    <section class="detalle-producto">

      <div class="breadcrumb">
        <span onclick="navegar('/')">Home</span> / 
        <span>${producto.categoria}</span> / 
        <strong>${producto.nombre}</strong>
      </div>

      <div class="detalle-contenedor">

        <div class="detalle-imagen">
          <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>

        <div class="detalle-info">

          <h2>${producto.nombre}</h2>
          <p class="precio-detalle">$${producto.precio}</p>

          <!-- COLORES -->
          <div class="opciones">
            <p>COLOR</p>
            <div class="colores">
              <span class="color blanco" data-color="Blanco"></span>
              <span class="color rojo" data-color="Rojo"></span>
              <span class="color negro" data-color="Negro"></span>
              <span class="color celeste" data-color="Celeste"></span>
              <span class="color verde" data-color="Verde"></span>
            </div>
          </div>

          <!-- TALLES -->
          <div class="opciones">
  <p>TALLE</p>

  <div class="talles">
    ${Object.keys(producto.stock).map(talle => `
      <button 
        data-talle="${talle}"
        class="${producto.stock[talle] === 0 ? 'agotado' : ''}"
        ${producto.stock[talle] === 0 ? 'disabled' : ''}
      >
        ${talle}
      </button>
    `).join("")}
  </div>

  <p id="mensajeStock" class="mensaje-stock"></p>

  <a href="#" class="guia">Guía de talles</a>
</div>

          <div class="selector-cantidad">
  <button type="button" onclick="cambiarCantidad(-1)">−</button>
  <span id="cantidadDetalle">1</span>
  <button type="button" onclick="cambiarCantidad(1)">+</button>
</div>


          <button id="btnAgregarDetalle"
          class="btn-principal deshabilitado"
          disabled
          onclick="agregarDesdeDetalle('${producto.nombre}', ${producto.precio})">
          Seleccioná un talle
          </button>

          <p class="cuotas">
            Hasta 3 cuotas sin interés de 
            <strong>$${Math.round(producto.precio / 3)}</strong>
          </p>

          <div class="descripcion-detalle">
            <h3>Descripción</h3>
            <p>
              Prenda de alta calidad diseñada para estilo urbano moderno.
              Confeccionada en denim premium.
            </p>
          </div>

          <button class="volver" onclick="navegar('/')">
            Volver
          </button>

        </div>
      </div>
    </section>
  `;

  iniciarOpcionesDetalle();
}

//  FUNCION GLOBAL 
function iniciarOpcionesDetalle() {

  function activarBotonAgregar() {

  const btn = document.getElementById("btnAgregarDetalle");
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("deshabilitado");
  btn.textContent = "AGREGAR AL CARRITO";
}

  const colores = document.querySelectorAll(".color");
  const talles = document.querySelectorAll(".talles button");

  colores.forEach(color => {
    color.addEventListener("click", () => {
      colores.forEach(c => c.classList.remove("activo"));
      color.classList.add("activo");
      seleccionColor = color.dataset.color;
    });
  });

talles.forEach(talle => {

  if (talle.classList.contains("agotado")) return;

  talle.addEventListener("click", () => {
    talles.forEach(t => t.classList.remove("activo"));
    talle.classList.add("activo");
    seleccionTalle = talle.dataset.talle;

    activarBotonAgregar();
    mostrarMensajeStock(seleccionTalle);
  });

});
}

function agregarDesdeDetalle(nombre, precio) {

  if (!seleccionTalle) return;

  const producto = productosGlobal.find(
    p => p.id === parseInt(window.location.pathname.split("/")[2])
  );

  if (!producto) return;

  // Verificar stock antes
  if (producto.stock[seleccionTalle] <= 0) {
    alert("Este talle está agotado.");
    return;
  }

  // Restar stock
  producto.stock[seleccionTalle]--;

  const nombreFinal = `${nombre} - Talle ${seleccionTalle}${
    seleccionColor ? " - " + seleccionColor : ""
  }`;

  agregarAlCarrito(
  nombreFinal,
  precio,
  cantidadSeleccionada,
  producto.imagen
);
  cantidadSeleccionada = 1;
document.getElementById("cantidadDetalle").textContent = 1;

  mostrarNotificacion();
  animarCarrito();
  animarBotonAgregado();

  // Si el stock llega a 0, actualizar vista
  if (producto.stock[seleccionTalle] === 0) {
    actualizarStockVisual(seleccionTalle);
  }
}

// Crear animación del botón
function animarBotonAgregado() {

  const btn = document.getElementById("btnAgregarDetalle");
  if (!btn) return;

  btn.textContent = "AGREGADO ✔";
  btn.classList.add("agregado");

  setTimeout(() => {
    btn.textContent = "Seleccioná un talle";
    btn.classList.remove("agregado");
    btn.classList.add("deshabilitado");
    btn.disabled = true;

    limpiarSeleccionDetalle();
  }, 1500);
}

// Limpiar selección después de agregar
function limpiarSeleccionDetalle() {

  seleccionColor = null;
  seleccionTalle = null;

  document.querySelectorAll(".color").forEach(c => c.classList.remove("activo"));
  document.querySelectorAll(".talles button").forEach(t => t.classList.remove("activo"));
}

function actualizarStockVisual(talleAgotado) {

  const botones = document.querySelectorAll(".talles button");

  botones.forEach(btn => {
    if (btn.dataset.talle === talleAgotado) {
      btn.classList.remove("activo");
      btn.classList.add("agotado");
      btn.disabled = true;
    }
  });

}

function mostrarMensajeStock(talle) {

  const producto = productosGlobal.find(
    p => p.id === parseInt(window.location.pathname.split("/")[2])
  );

  const mensaje = document.getElementById("mensajeStock");
  if (!mensaje) return;

  const cantidad = producto.stock[talle];

  if (cantidad > 0 && cantidad <= 2) {
    mensaje.textContent = `⚠ Últimas ${cantidad} unidades disponibles`;
  } else {
    mensaje.textContent = "";
  }
}

function cambiarCantidad(valor) {

  const producto = productosGlobal.find(
    p => p.id === parseInt(window.location.pathname.split("/")[2])
  );

  if (!producto || !seleccionTalle) return;

  const stockDisponible = producto.stock[seleccionTalle];

  cantidadSeleccionada += valor;

  if (cantidadSeleccionada < 1) cantidadSeleccionada = 1;
  if (cantidadSeleccionada > stockDisponible) {
    cantidadSeleccionada = stockDisponible;
  }

  document.getElementById("cantidadDetalle").textContent = cantidadSeleccionada;
}