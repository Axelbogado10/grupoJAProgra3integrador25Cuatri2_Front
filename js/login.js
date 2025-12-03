const login = document.getElementById('loginForm');

login.addEventListener('submit', function(event) {
    event.preventDefault();

    let nombreUser = document.getElementById('nombreUser').value;
    if(nombreUser.length > 0) {
        window.location.href = "/index.html";
    }
})