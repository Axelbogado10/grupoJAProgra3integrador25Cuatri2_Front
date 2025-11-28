const contenedorProductos = document.getElementById("contenedor-productos");
const filterInput = document.getElementById("filter-input");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const counterCart = document.getElementById("counter")
let url = "http://localhost:3000/api/products";


let cart = JSON.parse(localStorage.getItem("cart")) || [];

async function obtenerProductos(){
    try {
        let response = await fetch(`${url}`);

        console.log(`Solicitud fetch GET a ${url}`);

        let data = await response.json();

        console.log(data);
        let productos = data.payload;
        console.log(productos);


        productosGlobal = productos;
        mostrarProductos(productos);
    } catch (error) {
        console.error("Erros obteniendo productos: ", error)
    }
}

function mostrarProductos(array){
    let htmlProductos = "";
    array.forEach(prod => {
        htmlProductos += `
            <div class="product">
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>$${prod.precio}</p>
            <button onclick="addToCart(${prod.id})">agregar al carrito</button>
            </div>
        `;
    });

    contenedorProductos.innerHTML = htmlProductos;

}

function addToCart(id){
    const product = productosGlobal.find((p) => p.id === id );
    cart.push(product);
    renderCart();
    localStorage.setItem("cart", JSON.stringify(cart));

}

function renderCart(){
    let total = 0;
    cartItems.innerHTML = "";
    cart.forEach((itemCart, id) => {
        total += itemCart.precio;
        cartItems.innerHTML +=  `
        <li class="product-item">${itemCart.nombre} - Precio: $${itemCart.precio} <button onclick="eraseCart(${id})">Eliminar</button> </li>
        `;
    });
    cartItems.innerHTML +=`<button class="Delete-cart" onclick="DeleteCart()">Borrar Todo</button>`;
    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
    counterCart.innerHTML =` carrito: ${cart.length} productos`
};

function filtrarProductos(texto){
    let textoFiltrado = texto.toLowerCase();
    let filtrado = productosGlobal.filter(prod => prod.nombre.toLowerCase().includes(textoFiltrado));
    mostrarProductos(filtrado);
}

filterInput.addEventListener("input", (e) => {
    filtrarProductos(e.target.value);
});

function eraseCart(i){
    cart.splice(i,1);
    renderCart();
};

//funcion para eliminar TODOS los productos del carrito
function DeleteCart(){
    cart.splice(0,13);
    renderCart();
}

function init(){
    obtenerProductos();
    renderCart();
}

init()