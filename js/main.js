const url = "http://localhost:3000/api/products";

const productList   = document.getElementById("product-list");
const inputFiltro   = document.getElementById("filter");
const cartItems     = document.getElementById("cart-items");
const cartTotalEl   = document.getElementById("cart-total");
const cartCounter   = document.getElementById("cart-counter") || document.getElementById("counter");
const cartLabel     = document.getElementById("cart-label");
const emptyCartBtn  = document.getElementById("empty-cart");
const sortNameBtn   = document.getElementById("sort-name");
const sortPriceBtn  = document.getElementById("sort-price");

let productosGlobal = [];
let cart = [];
const storageKey = "cart";

/*==========================================================
  Obtener productos desde la API
==========================================================*/
async function obtenerProductos() {
  try {
    const response = await fetch(url);
    console.log(`Solicitud fetch GET a ${url}`);
    const data = await response.json();
    const productos = data.payload || [];

    console.log("Productos recibidos:", productos);

    productosGlobal = productos;
    renderProducts(productosGlobal);
  } catch (error) {
    console.error("Error obteniendo productos: ", error);
    renderProducts([]);
  }
}

/*==========================================================
 Render de productos en grilla
==========================================================*/
function renderProducts(items) {
  if (!productList) return;
  productList.innerHTML = "";

  if (!items || items.length === 0) {
    productList.innerHTML = `
      <div class="no-products">
        <img src="img/no-products.webp" alt="No hay productos disponibles">
        <h3>Producto no encontrado</h3>
        <p>No se encontró ningún producto</p>
      </div>`;
    return;
  }

  items.forEach((item) => {
    const imageSrc = item.ruta || item.imagen || "img/no-image.png";

    productList.innerHTML += `
      <div class="card-producto">
        <img src="${imageSrc}" alt="Imagen de ${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>$${item.precio}</p>
        <button type="button" onclick="agregarAlCarrito(${item.id})">
          Agregar al carrito
        </button>
      </div>`;
  });
}

/*==========================================================
 Filtro por input por nombres
==========================================================*/
function activarFiltroNombre() {
  if (!inputFiltro) return;
  inputFiltro.addEventListener("input", function () {
    const texto = inputFiltro.value.trim().toLowerCase();
    const base = productosGlobal || [];
    const resultado = base.filter((p) =>
      p.nombre && p.nombre.toLowerCase().includes(texto)
    );
    renderProducts(resultado);
  });
}

/*==========================================================
  Maneja Carrito (agregar, eliminar, mostrar)
==========================================================*/
function agregarAlCarrito(id) {
  const lista = productosGlobal || [];
  // Sin Number(), comparamos de forma simple
  const producto = lista.find((p) => p.id == id);
  if (!producto) return;

  const existente = cart.find((it) => it.id == id);
  if (existente) {
    existente.cantidad += 1;
    console.log(
      "Cantidad aumentada: " + existente.nombre + " x" + existente.cantidad
    );
  } else {
    cart.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    });
    console.log("Producto agregado: " + producto.nombre);
  }
  saveCart(cart);
  mostrarCarrito();
}

function eliminarProducto(index) {
  if (index < 0 || index >= cart.length) return;
  const removed = cart.splice(index, 1)[0];
  if (removed) console.log("Producto eliminado: " + removed.nombre);
  saveCart(cart);
  mostrarCarrito();
}

function mostrarCarrito() {
  if (!cartItems) return;
  cartItems.innerHTML = "";

  if (!cart || cart.length === 0) {
    cartItems.innerHTML = "<p>El carrito está vacío</p>";
    actualizarResumenCarrito();
    return;
  }

  cart.forEach(function (item, index) {
    const subtotal = (item.precio * item.cantidad).toFixed(2);
    cartItems.innerHTML +=
      '<li class="bloalgoue-item">' +
        '<p class="nombre-item">' +
          item.nombre +
          " x " +
          item.cantidad +
          " — $" +
          subtotal +
        "</p>" +
        '<button type="button" class="boton-eliminar" onclick="eliminarProducto(' +
          index +
        ')">Eliminar</button>' +
      "</li>";
  });

  actualizarResumenCarrito();
}

/*==========================================================
 Persistencia con localStorage
==========================================================*/
function loadCart() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("No se pudo leer el carrito de localStorage", e);
  }
  return [];
}

function saveCart(arr) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(arr));
  } catch (e) {
    console.warn("No se pudo guardar el carrito en localStorage", e);
  }
}

function restaurarCarritoDesdeStorage() {
  const guardado = loadCart();
  if (Array.isArray(guardado) && guardado.length > 0) {
    cart = guardado;
  } else {
    cart = [];
  }
  mostrarCarrito();
}

/*==========================================================
  Ejercicio7: Contador, header y total
==========================================================*/
function actualizarResumenCarrito() {
  if (!cartCounter || !cartLabel || !cartTotalEl) return;

  let unidades = 0;
  let total = 0;

  cart.forEach(function (item) {
    unidades += item.cantidad;
    total += item.precio * item.cantidad;
  });

  cartCounter.textContent = unidades;
  cartLabel.textContent =
    unidades + " " + (unidades === 1 ? "producto" : "productos");
  cartTotalEl.textContent = total.toFixed(2);
}

/*==========================================================
  Ejercicio8: Botones para ordenar
==========================================================*/
function activarOrdenamientos() {
  if (sortNameBtn) {
    sortNameBtn.addEventListener("click", function () {
      const porNombre = (productosGlobal || [])
        .slice()
        .sort(function (a, b) {
          return a.nombre.localeCompare(b.nombre);
        });
      renderProducts(porNombre);
    });
  }
  if (sortPriceBtn) {
    sortPriceBtn.addEventListener("click", function () {
      const porPrecio = (productosGlobal || [])
        .slice()
        .sort(function (a, b) {
          return a.precio - b.precio;
        });
      renderProducts(porPrecio);
    });
  }
}

/*==========================================================
  Ejercicio9: Vaciar carrito
==========================================================*/
function activarVaciadoCarrito() {
  if (!emptyCartBtn) return;
  emptyCartBtn.addEventListener("click", function () {
    if (cart.length === 0) return;
    cart.length = 0;
    console.log("Carrito vaciado");
    saveCart(cart);
    mostrarCarrito();
  });
}
function init() {
  restaurarCarritoDesdeStorage();

  obtenerProductos();

  activarFiltroNombre();
  activarOrdenamientos();
  activarVaciadoCarrito();
  actualizarResumenCarrito();
}

init();
