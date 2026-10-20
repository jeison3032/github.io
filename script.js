// Esperamos a que cargue todo el documento
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const menuButton = menu?.querySelector(".menu-btn");
    const menuContent = menu?.querySelector(".menu-content");

    if (menu && menuButton && menuContent) {
        function closeMenu() {
            menu.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }

        menuButton.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        menuContent.addEventListener("click", event => {
            if (event.target.closest("a")) closeMenu();
        });

        document.addEventListener("click", event => {
            if (!menu.contains(event.target)) closeMenu();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });
    }

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

    const ecoGamePanel = document.getElementById("eco-game-panel");
    if (ecoGamePanel) {
        const gameApp = ecoGamePanel.querySelector(".game-app");
        const gameArea = gameApp.querySelector("#game-area");
        const scoreEl = gameApp.querySelector("#score");
        const timerEl = gameApp.querySelector("#timer");
        const speedLevelEl = gameApp.querySelector("#speed-level");
        const highScoreEl = gameApp.querySelector("#high-score");
        const startScreen = gameApp.querySelector("#start-screen");
        const gameOverScreen = gameApp.querySelector("#game-over-screen");
        const startBtn = gameApp.querySelector("#start-btn");
        const restartBtn = gameApp.querySelector("#restart-btn");
        const comboBadge = gameApp.querySelector("#combo-badge");
        const finalScoreEl = gameApp.querySelector("#final-score");
        const statAccuracyEl = gameApp.querySelector("#stat-accuracy");
        const statMaxComboEl = gameApp.querySelector("#stat-max-combo");
        const newRecordTag = gameApp.querySelector("#new-record-tag");
        const binButtons = [...gameApp.querySelectorAll(".bin-btn")];
        const openGameBtn = document.querySelector(".eco-game-open");
        const backToGamesBtn = ecoGamePanel.querySelector(".eco-game-back");
        const itemsDatabase = [
            { name: "Cáscara de banano", icon: "🍌", category: "organico" },
            { name: "Cáscara de fruta", icon: "🍎", category: "organico" },
            { name: "Hojas secas", icon: "🍂", category: "organico" },
            { name: "Pan", icon: "🍞", category: "organico" },
            { name: "Té", icon: "🍵", category: "organico" },
            { name: "Comida dañada", icon: "🍕", category: "organico" },
            { name: "Botella plástica", icon: "🍾", category: "reciclaje" },
            { name: "Latas", icon: "🥫", category: "reciclaje" },
            { name: "Papel", icon: "📄", category: "reciclaje" },
            { name: "Cartón", icon: "📦", category: "reciclaje" },
            { name: "Metal", icon: "⚙️", category: "reciclaje" },
            { name: "Bolsa plástica", icon: "🛍️", category: "basura" },
            { name: "Foami", icon: "🧱", category: "basura" },
            { name: "Icopor", icon: "🍧", category: "basura" }
        ];
        const GAME_DURATION = 60;
        const INITIAL_SPAWN_RATE = 1250;
        const MIN_SPAWN_RATE = 950;
        const DIFFICULTY_INTERVAL = 10;
        const MAX_SPEED_MULTIPLIER = 1.5;

        let score = 0;
        let timeLeft = GAME_DURATION;
        let combo = 0;
        let maxCombo = 0;
        let totalItems = 0;
        let hits = 0;
        let speedMultiplier = 1;
        let spawnRateMs = INITIAL_SPAWN_RATE;
        let gameInterval = null;
        let spawnTimeout = null;
        let animationFrame = null;
        let activeItems = [];
        let isPlaying = false;
        let highScore = Number(localStorage.getItem("eco_high_score") || 0);
        let audioContext = null;

        highScoreEl.textContent = String(highScore);

        function playSound(frequency, type = "sine", duration = 0.15) {
            const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextConstructor) return;

            try {
                audioContext = audioContext || new AudioContextConstructor();
                if (audioContext.state === "suspended") {
                    audioContext.resume().catch(error => {
                        console.warn("No se pudo activar el audio del juego.", error);
                    });
                }

                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.type = type;
                oscillator.frequency.value = frequency;
                gain.gain.setValueAtTime(0.1, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn("No se pudo reproducir el sonido del juego.", error);
            }
        }

        function clearGame() {
            isPlaying = false;
            clearInterval(gameInterval);
            clearTimeout(spawnTimeout);
            if (animationFrame !== null) cancelAnimationFrame(animationFrame);
            gameInterval = null;
            spawnTimeout = null;
            animationFrame = null;
            activeItems.forEach(item => item.element.remove());
            activeItems = [];
        }

        function resetCombo() {
            combo = 0;
            comboBadge.classList.add("hidden");
        }

        function startGame() {
            clearGame();
            score = 0;
            timeLeft = GAME_DURATION;
            combo = 0;
            maxCombo = 0;
            totalItems = 0;
            hits = 0;
            speedMultiplier = 1;
            spawnRateMs = INITIAL_SPAWN_RATE;
            isPlaying = true;

            scoreEl.textContent = "0";
            timerEl.textContent = `${timeLeft}s`;
            speedLevelEl.textContent = "1.0x";
            comboBadge.classList.add("hidden");
            newRecordTag.classList.add("hidden");
            startScreen.classList.remove("active");
            gameOverScreen.classList.remove("active");
            gameOverScreen.classList.add("hidden");

            gameInterval = setInterval(updateTimer, 1000);
            scheduleNextSpawn();
            animationFrame = requestAnimationFrame(gameLoop);
        }

        function updateTimer() {
            timeLeft--;
            timerEl.textContent = `${timeLeft}s`;

            const elapsedTime = GAME_DURATION - timeLeft;
            if (elapsedTime % DIFFICULTY_INTERVAL === 0 && timeLeft > 0) {
                speedMultiplier = Math.min(MAX_SPEED_MULTIPLIER, speedMultiplier + 0.1);
                spawnRateMs = Math.max(MIN_SPAWN_RATE, spawnRateMs - 60);
                speedLevelEl.textContent = `${speedMultiplier.toFixed(1)}x`;
            }

            if (timeLeft <= 0) endGame();
        }

        function scheduleNextSpawn() {
            if (!isPlaying) return;
            spawnItem();
            spawnTimeout = setTimeout(scheduleNextSpawn, spawnRateMs / Math.sqrt(speedMultiplier));
        }

        function spawnItem() {
            if (!isPlaying) return;

            const isGolden = Math.random() < 0.12;
            const baseItem = itemsDatabase[Math.floor(Math.random() * itemsDatabase.length)];
            const itemData = isGolden
                ? { name: "Cuchara dorada", icon: "🥄", category: "reciclaje", isGolden: true }
                : { ...baseItem, isGolden: false };
            const element = document.createElement("div");
            const icon = document.createElement("span");
            const name = document.createElement("span");
            const maxX = Math.max(0, gameArea.clientWidth - 70);
            const startX = Math.floor(Math.random() * (maxX + 1));

            element.className = `falling-item${itemData.isGolden ? " golden-item" : ""}`;
            element.style.left = `${startX}px`;
            element.style.top = "-80px";
            icon.className = "item-icon";
            icon.textContent = itemData.icon;
            name.className = "item-name";
            name.textContent = itemData.name;
            element.append(icon, name);

            const item = {
                element,
                category: itemData.category,
                isGolden: itemData.isGolden,
                x: startX,
                y: -80,
                baseSpeed: 1.15 + Math.random() * 0.55,
                isDragging: false
            };

            setupDrag(element, item);
            gameArea.appendChild(element);
            activeItems.push(item);
        }

        function gameLoop() {
            if (!isPlaying) return;

            const areaHeight = gameArea.clientHeight;
            for (let index = activeItems.length - 1; index >= 0; index--) {
                const item = activeItems[index];
                if (item.isDragging) continue;

                item.y += item.baseSpeed * speedMultiplier;
                item.element.style.top = `${item.y}px`;
                if (item.y > areaHeight - 60) {
                    item.element.remove();
                    activeItems.splice(index, 1);
                    resetCombo();
                }
            }

            animationFrame = requestAnimationFrame(gameLoop);
        }

        function setupDrag(element, item) {
            element.addEventListener("pointerdown", event => {
                if (!isPlaying) return;
                event.preventDefault();
                item.isDragging = true;

                function onPointerMove(moveEvent) {
                    if (moveEvent.pointerId !== event.pointerId || !item.isDragging) return;
                    const rect = gameArea.getBoundingClientRect();
                    item.x = moveEvent.clientX - rect.left - 35;
                    item.y = moveEvent.clientY - rect.top - 35;
                    element.style.left = `${item.x}px`;
                    element.style.top = `${item.y}px`;
                }

                function onPointerUp(upEvent) {
                    if (upEvent.pointerId !== event.pointerId) return;
                    item.isDragging = false;
                    window.removeEventListener("pointermove", onPointerMove);
                    window.removeEventListener("pointerup", onPointerUp);
                    window.removeEventListener("pointercancel", onPointerCancel);

                    const bin = binButtons.find(button => {
                        const rect = button.getBoundingClientRect();
                        return upEvent.clientX >= rect.left && upEvent.clientX <= rect.right
                            && upEvent.clientY >= rect.top && upEvent.clientY <= rect.bottom;
                    });
                    if (bin) checkClassification(item, bin.dataset.category);
                }

                function onPointerCancel(cancelEvent) {
                    if (cancelEvent.pointerId !== event.pointerId) return;
                    item.isDragging = false;
                    window.removeEventListener("pointermove", onPointerMove);
                    window.removeEventListener("pointerup", onPointerUp);
                    window.removeEventListener("pointercancel", onPointerCancel);
                }

                window.addEventListener("pointermove", onPointerMove);
                window.addEventListener("pointerup", onPointerUp);
                window.addEventListener("pointercancel", onPointerCancel);
            });
        }

        function checkClassification(item, targetCategory) {
            if (!isPlaying || !activeItems.includes(item)) return;
            totalItems++;

            if (item.category === targetCategory) {
                hits++;
                combo++;
                maxCombo = Math.max(maxCombo, combo);
                let points = 100 * (1 + (combo > 1 ? combo * 0.2 : 0));
                if (item.isGolden) {
                    points += 20;
                    playSound(880, "triangle", 0.3);
                } else {
                    playSound(523.25);
                }
                score += Math.round(points);

                if (combo >= 2) {
                    comboBadge.textContent = `COMBO x${combo}!`;
                    comboBadge.classList.remove("hidden");
                }
            } else {
                resetCombo();
                score = Math.max(0, score - 50);
                playSound(150, "sawtooth", 0.2);
            }

            scoreEl.textContent = String(score);
            item.element.remove();
            activeItems.splice(activeItems.indexOf(item), 1);
        }

        function endGame() {
            clearGame();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("eco_high_score", String(highScore));
                highScoreEl.textContent = String(highScore);
                newRecordTag.classList.remove("hidden");
            }

            const accuracy = totalItems > 0 ? Math.round((hits / totalItems) * 100) : 0;
            finalScoreEl.textContent = String(score);
            statAccuracyEl.textContent = `${accuracy}%`;
            statMaxComboEl.textContent = `${maxCombo}x`;
            gameOverScreen.classList.remove("hidden");
            gameOverScreen.classList.add("active");
        }

        binButtons.forEach(bin => {
            bin.addEventListener("click", () => {
                if (!isPlaying) return;
                const lowestItem = activeItems
                    .filter(item => !item.isDragging)
                    .reduce((lowest, item) => !lowest || item.y > lowest.y ? item : lowest, null);
                if (lowestItem) checkClassification(lowestItem, bin.dataset.category);
            });
        });

        openGameBtn.addEventListener("click", () => {
            ecoGamePanel.classList.remove("hidden");
            ecoGamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        backToGamesBtn.addEventListener("click", () => {
            clearGame();
            startScreen.classList.add("active");
            gameOverScreen.classList.remove("active");
            gameOverScreen.classList.add("hidden");
            ecoGamePanel.classList.add("hidden");
            document.getElementById("juegos").scrollIntoView({ behavior: "smooth", block: "start" });
        });

        startBtn.addEventListener("click", startGame);
        restartBtn.addEventListener("click", startGame);
    }

    const memoryGamePanel = document.getElementById("memory-game-panel");
    if (memoryGamePanel) {
        const gridContainer = memoryGamePanel.querySelector("#memory-cards-grid");
        const movesTxt = memoryGamePanel.querySelector("#moves-count");
        const matchesTxt = memoryGamePanel.querySelector("#matches-count");
        const winBanner = memoryGamePanel.querySelector("#win-message-banner");
        const finalMovesTxt = memoryGamePanel.querySelector("#final-moves-txt");
        const levelBtns = [...memoryGamePanel.querySelectorAll(".level-btn")];
        const resetBtn = memoryGamePanel.querySelector("#reset-game-btn");
        const openGameBtn = document.querySelector(".memory-game-open");
        const backToGamesBtn = memoryGamePanel.querySelector(".memory-game-back");
        const allPairs = [
            { id: 1, itemA: { icon: "🍌", text: "Banano" }, itemB: { icon: "🍂", text: "Orgánico" } },
            { id: 2, itemA: { icon: "🍾", text: "Botella" }, itemB: { icon: "♻️", text: "Reciclaje" } },
            { id: 3, itemA: { icon: "🥫", text: "Lata" }, itemB: { icon: "⚙️", text: "Metal" } },
            { id: 4, itemA: { icon: "🛍️", text: "Bolsa" }, itemB: { icon: "🗑️", text: "Basura" } },
            { id: 5, itemA: { icon: "📦", text: "Caja" }, itemB: { icon: "📄", text: "Papel" } },
            { id: 6, itemA: { icon: "🍕", text: "Comida" }, itemB: { icon: "🌱", text: "Compost" } },
            { id: 7, itemA: { icon: "☕", text: "Taza" }, itemB: { icon: "🥛", text: "Vidrio" } },
            { id: 8, itemA: { icon: "💡", text: "Foco" }, itemB: { icon: "⚠️", text: "Peligroso" } }
        ];
        const levelsConfig = {
            1: { pairCount: 4, className: "grid-level-1" },
            2: { pairCount: 6, className: "grid-level-2" },
            3: { pairCount: 8, className: "grid-level-3" }
        };
        let currentLevel = 1;
        let selectedCards = [];
        let moves = 0;
        let matchesCount = 0;
        let isLocking = false;
        let mismatchTimeout = null;

        function startMemoryLevel(levelNumber) {
            const config = levelsConfig[levelNumber];
            if (!config) return;

            clearTimeout(mismatchTimeout);
            mismatchTimeout = null;
            currentLevel = levelNumber;
            selectedCards = [];
            moves = 0;
            matchesCount = 0;
            isLocking = false;

            movesTxt.textContent = "0";
            matchesTxt.textContent = `0 / ${config.pairCount}`;
            winBanner.classList.add("hidden");
            gridContainer.className = `cards-grid ${config.className}`;
            gridContainer.replaceChildren();

            levelBtns.forEach(button => {
                const isActive = Number(button.dataset.level) === levelNumber;
                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });

            const deck = allPairs.slice(0, config.pairCount).flatMap(pair => [
                { pairId: pair.id, icon: pair.itemA.icon, text: pair.itemA.text },
                { pairId: pair.id, icon: pair.itemB.icon, text: pair.itemB.text }
            ]);

            for (let index = deck.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
            }

            deck.forEach(data => {
                const cardEl = document.createElement("button");
                cardEl.type = "button";
                cardEl.className = "card-item";
                cardEl.dataset.pairId = String(data.pairId);
                cardEl.setAttribute("aria-label", "Carta oculta");
                cardEl.innerHTML = '<span class="card-icon-txt">❓</span>';
                cardEl.addEventListener("click", () => onMemoryCardClick(cardEl, data, config));
                gridContainer.appendChild(cardEl);
            });
        }

        function onMemoryCardClick(cardEl, data, config) {
            if (
                isLocking
                || cardEl.classList.contains("revealed")
                || cardEl.classList.contains("matched-card")
            ) {
                return;
            }

            cardEl.classList.add("revealed");
            cardEl.setAttribute("aria-label", `${data.text}: ${data.icon}`);
            cardEl.innerHTML = `
                <span class="card-icon-txt">${data.icon}</span>
                <span class="card-label-txt">${data.text}</span>
            `;
            selectedCards.push({ element: cardEl, data });

            if (selectedCards.length === 2) {
                moves++;
                movesTxt.textContent = String(moves);
                checkMemoryMatch(config);
            }
        }

        function checkMemoryMatch(config) {
            isLocking = true;
            const [card1, card2] = selectedCards;

            if (card1.data.pairId === card2.data.pairId) {
                card1.element.classList.add("matched-card");
                card2.element.classList.add("matched-card");
                matchesCount++;
                matchesTxt.textContent = `${matchesCount} / ${config.pairCount}`;
                selectedCards = [];
                isLocking = false;

                if (matchesCount === config.pairCount) {
                    finalMovesTxt.textContent = String(moves);
                    winBanner.classList.remove("hidden");
                }
                return;
            }

            mismatchTimeout = window.setTimeout(() => {
                [card1, card2].forEach(card => {
                    card.element.classList.remove("revealed");
                    card.element.setAttribute("aria-label", "Carta oculta");
                    card.element.innerHTML = '<span class="card-icon-txt">❓</span>';
                });
                selectedCards = [];
                isLocking = false;
                mismatchTimeout = null;
            }, 800);
        }

        levelBtns.forEach(button => {
            button.addEventListener("click", () => {
                startMemoryLevel(Number(button.dataset.level));
            });
        });

        resetBtn.addEventListener("click", () => startMemoryLevel(currentLevel));
        openGameBtn.addEventListener("click", () => {
            memoryGamePanel.classList.remove("hidden");
            memoryGamePanel.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        backToGamesBtn.addEventListener("click", () => {
            startMemoryLevel(currentLevel);
            memoryGamePanel.classList.add("hidden");
            document.getElementById("juegos").scrollIntoView({ behavior: "smooth", block: "start" });
        });

        startMemoryLevel(1);
    }

    const slingshotPanel = document.getElementById("eco-lanza-panel");
    if (slingshotPanel) {
        const items = [
            { name: "Cáscara de banano", icon: "🍌", category: "organico" },
            { name: "Manzana", icon: "🍎", category: "organico" },
            { name: "Hojas secas", icon: "🍂", category: "organico" },
            { name: "Botella de plástico", icon: "🍾", category: "reciclaje" },
            { name: "Lata de aluminio", icon: "🥫", category: "reciclaje" },
            { name: "Caja de cartón", icon: "📦", category: "reciclaje" },
            { name: "Bolsa sucia", icon: "🛍️", category: "basura" },
            { name: "Foco roto", icon: "💡", category: "basura" },
            { name: "Comida dañada", icon: "🍕", category: "organico" },
            { name: "Papel usado", icon: "📄", category: "reciclaje" }
        ];
        const canvasArea = slingshotPanel.querySelector("#slingshot-canvas-area");
        const pocket = slingshotPanel.querySelector("#slingshot-pocket");
        const emojiDisplay = slingshotPanel.querySelector("#projectile-emoji");
        const currentNameEl = slingshotPanel.querySelector("#current-item-name");
        const scoreEl = slingshotPanel.querySelector("#sling-score");
        const timerEl = slingshotPanel.querySelector("#sling-timer");
        const errorsEl = slingshotPanel.querySelector("#sling-errors");
        const feedbackEl = slingshotPanel.querySelector("#sling-feedback");
        const winBanner = slingshotPanel.querySelector("#sling-win-banner");
        const finalScoreEl = slingshotPanel.querySelector("#final-sling-score");
        const finalCorrectEl = slingshotPanel.querySelector("#final-sling-correct");
        const resetBtn = slingshotPanel.querySelector("#sling-reset-btn");
        const playAgainBtn = slingshotPanel.querySelector("#sling-play-again-btn");
        const targetBins = [...slingshotPanel.querySelectorAll(".target-bin")];
        const openGameBtn = document.querySelector(".eco-lanza-open");
        const backToGamesBtn = slingshotPanel.querySelector(".eco-lanza-back");

        const GAME_DURATION_SECONDS = 60;
        const ERROR_COOLDOWN_MS = 1000;
        let currentItemIndex = 0;
        let roundItems = [];
        let score = 0;
        let errors = 0;
        let isDragging = false;
        let isFlying = false;
        let isCoolingDown = false;
        let isGameActive = false;
        let dragOrigin = { x: 0, y: 0 };
        let dragPosition = { x: 0, y: 0 };
        let animationFrame = null;
        let activeProjectile = null;
        let timerInterval = null;
        let cooldownTimeout = null;
        let gameEndsAt = 0;
        let feedbackTimeouts = [];

        function clearFeedback() {
            feedbackTimeouts.forEach(timeout => clearTimeout(timeout));
            feedbackTimeouts = [];
            targetBins.forEach(bin => bin.classList.remove("hit-success", "hit-wrong"));
        }

        function resetPocket() {
            pocket.style.left = "-22px";
            pocket.style.top = "-15px";
            pocket.style.transform = "translate(0px, 0px)";
            pocket.style.display = "flex";
        }

        function loadCurrentItem() {
            const item = roundItems[currentItemIndex % roundItems.length];
            emojiDisplay.textContent = item.icon;
            currentNameEl.textContent = item.name;
        }

        function initGame(startImmediately = false) {
            clearInterval(timerInterval);
            clearTimeout(cooldownTimeout);
            if (animationFrame !== null) cancelAnimationFrame(animationFrame);
            animationFrame = null;
            if (activeProjectile) activeProjectile.remove();
            activeProjectile = null;
            clearFeedback();
            currentItemIndex = 0;
            roundItems = [...items];
            for (let index = roundItems.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [roundItems[index], roundItems[randomIndex]] = [roundItems[randomIndex], roundItems[index]];
            }
            score = 0;
            errors = 0;
            isDragging = false;
            isFlying = false;
            isCoolingDown = false;
            isGameActive = false;
            pocket.classList.remove("cooling-down");
            pocket.setAttribute("aria-disabled", "true");
            gameEndsAt = 0;
            scoreEl.textContent = "0";
            timerEl.textContent = `${GAME_DURATION_SECONDS} s`;
            errorsEl.textContent = "0";
            feedbackEl.textContent = "Arrastra el residuo hacia atrás y suéltalo para lanzarlo.";
            winBanner.classList.add("hidden");
            resetPocket();
            loadCurrentItem();
            if (startImmediately) startGameTimer();
        }

        function startGameTimer() {
            clearInterval(timerInterval);
            isGameActive = true;
            pocket.setAttribute("aria-disabled", "false");
            gameEndsAt = Date.now() + GAME_DURATION_SECONDS * 1000;

            timerInterval = window.setInterval(() => {
                const remainingMs = Math.max(0, gameEndsAt - Date.now());
                const remainingSeconds = Math.ceil(remainingMs / 1000);
                timerEl.textContent = `${remainingSeconds} s`;
                timerEl.classList.toggle("time-running-low", remainingSeconds <= 10);

                if (remainingMs <= 0) endGame();
            }, 100);
        }

        function endGame() {
            if (!isGameActive) return;
            isGameActive = false;
            isFlying = false;
            isDragging = false;
            isCoolingDown = false;
            pocket.classList.remove("cooling-down");
            pocket.setAttribute("aria-disabled", "true");
            clearInterval(timerInterval);
            clearTimeout(cooldownTimeout);
            if (animationFrame !== null) cancelAnimationFrame(animationFrame);
            animationFrame = null;
            if (activeProjectile) activeProjectile.remove();
            activeProjectile = null;
            resetPocket();
            finalScoreEl.textContent = String(score);
            finalCorrectEl.textContent = String(Math.floor(score / 150));
            winBanner.classList.remove("hidden");
        }

        function getPocketOrigin() {
            const canvasRect = canvasArea.getBoundingClientRect();
            const pocketRect = pocket.getBoundingClientRect();
            return {
                x: pocketRect.left - canvasRect.left + pocketRect.width / 2,
                y: pocketRect.top - canvasRect.top + pocketRect.height / 2
            };
        }

        function startDrag(event) {
            if (!isGameActive || isFlying || isCoolingDown || event.button > 0) return;
            event.preventDefault();
            isDragging = true;
            dragOrigin = getPocketOrigin();
            dragPosition = { ...dragOrigin };
            pocket.setPointerCapture(event.pointerId);
        }

        function moveDrag(event) {
            if (!isDragging) return;
            const canvasRect = canvasArea.getBoundingClientRect();
            let x = event.clientX - canvasRect.left;
            let y = event.clientY - canvasRect.top;
            const dx = x - dragOrigin.x;
            const dy = y - dragOrigin.y;
            const distance = Math.hypot(dx, dy);
            const maxDistance = 80;

            if (distance > maxDistance) {
                const scale = maxDistance / distance;
                x = dragOrigin.x + dx * scale;
                y = dragOrigin.y + dy * scale;
            }

            dragPosition = { x, y };
            pocket.style.transform = `translate(${x - dragOrigin.x}px, ${y - dragOrigin.y}px)`;
        }

        function finishDrag(event) {
            if (!isDragging) return;
            isDragging = false;
            if (event.type === "pointercancel") {
                resetPocket();
                return;
            }
            if (Math.hypot(dragPosition.x - dragOrigin.x, dragPosition.y - dragOrigin.y) < 10) {
                resetPocket();
                return;
            }
            launchProjectile();
        }

        function launchFromKeyboard() {
            if (!isGameActive || isFlying || isCoolingDown) return;
            dragOrigin = getPocketOrigin();
            dragPosition = { x: dragOrigin.x - 65, y: dragOrigin.y };
            launchProjectile();
        }

        function launchProjectile() {
            isFlying = true;
            pocket.style.display = "none";
            const item = roundItems[currentItemIndex % roundItems.length];
            const projectile = document.createElement("div");
            projectile.className = "flying-projectile";
            projectile.setAttribute("aria-hidden", "true");
            projectile.textContent = item.icon;
            canvasArea.appendChild(projectile);
            activeProjectile = projectile;

            let posX = dragPosition.x;
            let posY = dragPosition.y;
            let velocityX = (dragOrigin.x - dragPosition.x) * 0.42;
            let velocityY = (dragOrigin.y - dragPosition.y) * 0.42;
            const gravity = 0.18;
            let frames = 0;

            function animateProjectile() {
                posX += velocityX;
                posY += velocityY;
                velocityY += gravity;
                projectile.style.left = `${posX - 25}px`;
                projectile.style.top = `${posY - 25}px`;
                frames++;

                const canvasRect = canvasArea.getBoundingClientRect();
                const hitBin = targetBins.find(bin => {
                    const binRect = bin.getBoundingClientRect();
                    const left = binRect.left - canvasRect.left;
                    const right = binRect.right - canvasRect.left;
                    const top = binRect.top - canvasRect.top;
                    const bottom = binRect.bottom - canvasRect.top;
                    return posX >= left && posX <= right && posY >= top && posY <= bottom;
                });

                if (hitBin) {
                    const isCorrect = hitBin.dataset.category === item.category;
                    finishTurn(projectile, isCorrect, hitBin);
                    return;
                }

                if (
                    posX < -25
                    || posX > canvasArea.clientWidth + 25
                    || posY > canvasArea.clientHeight + 25
                    || frames > 300
                ) {
                    finishTurn(projectile, false);
                    return;
                }

                animationFrame = requestAnimationFrame(animateProjectile);
            }

            animationFrame = requestAnimationFrame(animateProjectile);
        }

        function finishTurn(projectile, isCorrect, hitBin = null) {
            if (animationFrame !== null) cancelAnimationFrame(animationFrame);
            animationFrame = null;
            projectile.remove();
            activeProjectile = null;
            if (!isGameActive) return;

            if (isCorrect) {
                score += 150;
                feedbackEl.textContent = "¡Bien! Ese residuo va en el contenedor correcto.";
                if (hitBin) hitBin.classList.add("hit-success");
            } else {
                errors++;
                isCoolingDown = true;
                pocket.classList.add("cooling-down");
                pocket.setAttribute("aria-disabled", "true");
                feedbackEl.textContent = "No era el contenedor correcto. Espera un segundo mientras el tiempo sigue corriendo.";
                if (hitBin) hitBin.classList.add("hit-wrong");
                cooldownTimeout = window.setTimeout(() => {
                    isCoolingDown = false;
                    cooldownTimeout = null;
                    pocket.classList.remove("cooling-down");
                    pocket.setAttribute("aria-disabled", "false");
                    if (isGameActive) {
                        feedbackEl.textContent = "Arrastra el residuo hacia atrás y suéltalo para lanzarlo.";
                    }
                }, ERROR_COOLDOWN_MS);
            }

            if (hitBin) {
                feedbackTimeouts.push(window.setTimeout(() => {
                    hitBin.classList.remove("hit-success", "hit-wrong");
                }, 400));
            }

            currentItemIndex = (currentItemIndex + 1) % roundItems.length;
            scoreEl.textContent = String(score);
            errorsEl.textContent = String(errors);
            isFlying = false;
            resetPocket();
            loadCurrentItem();
        }

        pocket.addEventListener("pointerdown", startDrag);
        pocket.addEventListener("pointermove", moveDrag);
        pocket.addEventListener("pointerup", finishDrag);
        pocket.addEventListener("pointercancel", finishDrag);
        pocket.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                launchFromKeyboard();
            }
        });
        resetBtn.addEventListener("click", () => initGame(true));
        playAgainBtn.addEventListener("click", () => initGame(true));
        openGameBtn.addEventListener("click", () => {
            slingshotPanel.classList.remove("hidden");
            initGame(true);
            slingshotPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        backToGamesBtn.addEventListener("click", () => {
            initGame();
            slingshotPanel.classList.add("hidden");
            document.getElementById("juegos").scrollIntoView({ behavior: "smooth", block: "start" });
        });

        initGame();
    }
});