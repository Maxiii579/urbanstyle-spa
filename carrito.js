let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarritoUI() {
  const contador = document.getElementById("contador");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalElemento = document.getElementById("total");

  if (!listaCarrito) return;

  listaCarrito.innerHTML = "";
  let total = 0;
  let totalCantidad = 0;

  carrito.forEach((producto) => {

    const li = document.createElement("li");

    li.innerHTML = `
  <div class="item-carrito">

    <div class="item-info">
      <div class="item-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>

       <div class="item-detalles">
        <p class="nombre-carrito">${producto.nombre}</p>
        <p class="precio-unitario">$${formatearPrecio(producto.precio)}</p>
        <p class="subtotal">
          Subtotal: $${formatearPrecio(producto.precio * producto.cantidad)}
        </p>
      </div>
    </div>

    <div class="lado-derecho">
      <div class="controles-carrito">
        <button onclick="modificarCantidad('${producto.nombre}', -1)">−</button>
        <span>${producto.cantidad}</span>
        <button onclick="modificarCantidad('${producto.nombre}', 1)">+</button>
      </div>

      <button class="btn-eliminar"
        onclick="eliminarProductoCarrito('${producto.nombre}')">
        🗑
      </button>
    </div>

  </div>
`;

    listaCarrito.appendChild(li);

    total += producto.precio * producto.cantidad;
    totalCantidad += producto.cantidad;
  });

  if (contador) contador.textContent = totalCantidad;
  if (totalElemento) totalElemento.textContent = formatearPrecio(total);
}


// ======================
// AGREGAR AL CARRITO
// ======================

function agregarAlCarrito(nombre, precio, cantidad = 1, imagen = null) {

  const productoExistente = carrito.find(p => p.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, cantidad, imagen });
  }

  guardarCarrito();
  actualizarCarritoUI();
}

// ======================
// MODIFICAR CANTIDAD
// ======================

function modificarCantidad(nombre, cambio) {

  const producto = carrito.find(p => p.nombre === nombre);
  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(p => p.nombre !== nombre);
  }

  guardarCarrito();
  actualizarCarritoUI();
}


// ======================
// VACIAR
// ======================

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
}


// ======================
// WHATSAPP
// ======================

function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "Hola! Quiero comprar:\n";

  carrito.forEach(producto => {
    mensaje += `- ${producto.nombre} x${producto.cantidad} ($${producto.precio * producto.cantidad})\n`;
  });

  const url = `https://wa.me/5491150080020?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}


// ======================
// CHECKOUT
// ======================

function finalizarCompra() {

  const app = document.getElementById("app");

  const numeroOrden = Math.floor(Math.random() * 100000);

  app.innerHTML = `
    <section class="compra-exitosa">
      <div class="compra-card">
        <div class="check-animado">✔</div>
        <h2>¡Compra realizada con éxito!</h2>
        <p>Tu número de orden es <strong>#${numeroOrden}</strong></p>
        <p>Te enviaremos los detalles por WhatsApp.</p>
        <p class="redireccion">Redirigiendo al inicio...</p>
      </div>
    </section>
  `;

  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();

  setTimeout(() => {
    navegar("/");
  }, 3500);
}


//Crear función eliminar elegante
function eliminarProductoCarrito(nombre) {

  const items = document.querySelectorAll(".item-carrito");

  items.forEach(item => {
    if (item.innerText.includes(nombre)) {
      item.style.opacity = "0";
      item.style.transform = "translateX(20px)";
    }
  });

  setTimeout(() => {
    carrito = carrito.filter(p => p.nombre !== nombre);
    guardarCarrito();
    actualizarCarritoUI();
  }, 200);
}

// Formatear precios correctamente
function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR");
}