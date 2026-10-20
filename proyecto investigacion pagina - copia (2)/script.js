// Esperamos a que cargue todo el documento
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginform");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que la página se recargue

        // Obtenemos los valores de los inputs basados en sus IDs del HTML
        const nombre = document.getElementById("loginname").value;
        const curso = document.getElementById("logincurse").value;

        // Creamos un objeto con los datos
        const nuevoRegistro = {
            nombre: nombre,
            curso: curso,
            fecha: new Date().toLocaleDateString()
        };

        // Recuperamos los registros anteriores del localStorage (si existen)
        let registros = JSON.parse(localStorage.getItem("listaAsistentes")) || [];

        // Agregamos el nuevo registro a la lista
        registros.push(nuevoRegistro);

        // Guardamos la lista actualizada de vuelta en el localStorage
        localStorage.setItem("listaAsistentes", JSON.stringify(registros));

        // Mensaje de éxito y limpieza del formulario
        alert("¡Gracias por dejar tu huella! Tus datos han sido guardados.");
        loginForm.reset();
    });
}

    document.querySelectorAll("[data-rompecabezas]").forEach(juego => {
        const tablero = juego.querySelector(".tablero-juego");
        const progreso = juego.querySelector(".juego-progreso");
        const mensaje = juego.querySelector(".juego-mensaje");
        const reiniciar = juego.querySelector(".juego-control");
        const rutaImagen = juego.dataset.imagen;
        const imagen = new Image();
        let fichas = [];
        let movimientos = 0;
        let terminado = false;

        function dibujarTablero() {
            tablero.replaceChildren();

            fichas.forEach((ficha, indice) => {
                if (ficha === 0) {
                    const espacio = document.createElement("div");
                    espacio.className = "casilla-vacia";
                    espacio.setAttribute("aria-label", "Espacio vacío");
                    tablero.appendChild(espacio);
                    return;
                }

                const boton = document.createElement("button");
                const posicionImagen = ficha - 1;
                boton.type = "button";
                boton.className = "ficha-juego";
                boton.dataset.indice = String(indice);
                boton.setAttribute("aria-label", `Pieza ${ficha}`);
                boton.style.backgroundImage = `url("${rutaImagen}")`;
                boton.style.backgroundPosition = `${(posicionImagen % 3) * 50}% ${Math.floor(posicionImagen / 3) * 50}%`;
                tablero.appendChild(boton);
            });

            progreso.textContent = `Movimientos: ${movimientos}`;
        }

        function esSolucionado() {
            return fichas.every((ficha, indice) => ficha === (indice + 1) % fichas.length);
        }

        function mezclarTablero() {
            fichas = [1, 2, 3, 4, 5, 6, 7, 8, 0];
            let espacio = 8;
            let anterior = -1;

            for (let paso = 0; paso < 100; paso++) {
                const vecinos = [espacio - 3, espacio + 3];

                if (espacio % 3 > 0) vecinos.push(espacio - 1);
                if (espacio % 3 < 2) vecinos.push(espacio + 1);

                const posibles = vecinos.filter(indice =>
                    indice >= 0 && indice < 9 && indice !== anterior
                );
                const destino = posibles[Math.floor(Math.random() * posibles.length)];
                [fichas[espacio], fichas[destino]] = [fichas[destino], fichas[espacio]];
                anterior = espacio;
                espacio = destino;
            }

            if (esSolucionado()) {
                mezclarTablero();
                return;
            }

            movimientos = 0;
            terminado = false;
            mensaje.textContent = "Mueve una ficha junto al espacio vacío.";
            dibujarTablero();
        }

        imagen.addEventListener("load", () => {
            tablero.style.aspectRatio = `${imagen.naturalWidth} / ${imagen.naturalHeight}`;
            tablero.style.setProperty("--pieza-aspect-ratio", `${imagen.naturalWidth} / ${imagen.naturalHeight}`);
            mezclarTablero();
        });

        imagen.addEventListener("error", () => {
            mensaje.textContent = `No se pudo cargar la imagen: ${rutaImagen}`;
            console.error(`No se pudo cargar la imagen del rompecabezas: ${rutaImagen}`);
        });

        tablero.addEventListener("click", evento => {
            if (terminado) return;

            const boton = evento.target.closest(".ficha-juego");
            if (!boton) return;

            const indice = Number(boton.dataset.indice);
            const espacio = fichas.indexOf(0);
            const mismaFila = Math.floor(indice / 3) === Math.floor(espacio / 3);
            const adyacente = (mismaFila && Math.abs(indice - espacio) === 1)
                || Math.abs(indice - espacio) === 3;

            if (!adyacente) {
                mensaje.textContent = "Esa pieza no está junto al espacio vacío.";
                return;
            }

            [fichas[indice], fichas[espacio]] = [fichas[espacio], fichas[indice]];
            movimientos++;
            dibujarTablero();

            if (esSolucionado()) {
                terminado = true;
                mensaje.textContent = `¡Imagen completada en ${movimientos} movimientos! ♻️`;
            } else {
                mensaje.textContent = "¡Buen movimiento! Sigue armando la imagen.";
            }
        });

        reiniciar.addEventListener("click", mezclarTablero);
        imagen.src = rutaImagen;
    });
});