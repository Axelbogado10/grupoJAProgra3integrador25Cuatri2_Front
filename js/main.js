let contenedorProductos = document.getElementById("contenedor-productos");
let url = "http:/localhost:3000";

async function obtenerProductos(){
    try {
        let response = await fetch(`${url}/products`);

        console.log(`Solicitud fetch GET a ${url}/products`);

        let data = await response.json();

        console.log(data);
        let productos = data.payload;
        console.log(productos);

        mostrarProductos(productos);
    } catch (error) {
        console.error("Erros obteniendo productos: ", error)
    }
}

function mostrarProductos(array){
    let htmlProductos = "";
    array.forEach(prod => {
        htmlProductos += `
            <div class="card-producto">
            <img srx="${prod.image}" alt="${prod.name}">
            <h3>${prod.name}</h3>
            <p>Id: ${prod.id}</p>
            <p>$${prod.price}</p>
        `;
    });

    contenedorProductos.innerHTML = htmlProductos;
}

function init(){
    obtenerProductos();
}

init()