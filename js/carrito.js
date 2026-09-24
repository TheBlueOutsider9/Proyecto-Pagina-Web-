document.addEventListener("DOMContentLoaded", function() {
    const isInProductos = window.location.pathname.includes('/productos/');
    const prefix = isInProductos ? '../' : '';

    const carritoHTML = `
    <div id="carrito-panel" class="carrito-panel">
        <div class="carrito-header">
            <h2 style="font-family: 'Playfair Display', serif; color: var(--azul-marino); margin: 0;">Tu Carrito</h2>
            <span class="cerrar-carrito" id="cerrar-carrito" style="cursor: pointer; font-size: 2rem; line-height: 1;">&times;</span>
        </div>
        <div id="carrito-items" style="flex: 1; display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
        </div>
        <div class="carrito-footer" style="border-top: 1px solid #eee; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; color: var(--azul-marino); margin-bottom: 20px;">
                <span>Total:</span>
                <span id="carrito-total">$0.00</span>
            </div>
            <button id="btn-comprar" class="btn-oscuro" style="width: 100%; padding: 15px; font-size: 1rem; font-weight: bold;">PROCEDER AL PAGO</button>
        </div>
    </div>
    <div id="carrito-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', carritoHTML);

    const panel = document.getElementById("carrito-panel");
    const overlay = document.getElementById("carrito-overlay");
    const btnCerrar = document.getElementById("cerrar-carrito");
    const itemsContainer = document.getElementById("carrito-items");
    const totalElement = document.getElementById("carrito-total");
    const btnComprar = document.getElementById("btn-comprar");

    const navCartBtns = document.querySelectorAll('.iconos-nav span');
    navCartBtns.forEach(span => {
        if(span.innerText.toLowerCase().includes("carrito")) {
            span.style.cursor = "pointer";
            span.style.position = "relative";
            
            const badge = document.createElement("span");
            badge.className = "carrito-badge-js";
            badge.style.position = "absolute";
            badge.style.top = "-8px";
            badge.style.right = "-12px";
            badge.style.backgroundColor = "#CFA76B";
            badge.style.color = "#fff";
            badge.style.fontSize = "0.7rem";
            badge.style.fontWeight = "bold";
            badge.style.borderRadius = "50%";
            badge.style.padding = "2px 6px";
            badge.style.display = "none";
            badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
            
            span.appendChild(badge);
            span.addEventListener("click", abrirCarrito);
        }
    });
    
    function actualizarBadges() {
        let totalItems = 0;
        carrito.forEach(item => totalItems += item.cantidad);
        
        const badges = document.querySelectorAll('.carrito-badge-js');
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.innerText = totalItems;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        });
    }

    function abrirCarrito() {
        panel.classList.add("abierto");
        overlay.style.display = "block";
        renderCarrito();
    }

    function cerrarCarrito() {
        panel.classList.remove("abierto");
        overlay.style.display = "none";
    }

    if(btnCerrar) btnCerrar.addEventListener("click", cerrarCarrito);
    if(overlay) overlay.addEventListener("click", cerrarCarrito);

    let carrito = JSON.parse(localStorage.getItem('zafiro_carrito')) || [];

    function guardarCarrito() {
        localStorage.setItem('zafiro_carrito', JSON.stringify(carrito));
    }

    function parsePrecio(precioStr) {
        return parseFloat(precioStr.replace('$', '').replace('.', '').replace(',', '.'));
    }
    function formatPrecio(precioNum) {
        return '$' + precioNum.toFixed(2).replace('.', ',');
    }

    window.modificarCantidad = function(nombre, delta) {
        const item = carrito.find(i => i.nombre === nombre);
        if (item) {
            item.cantidad += delta;
            if (item.cantidad <= 0) {
                carrito = carrito.filter(i => i.nombre !== nombre);
            }
            guardarCarrito();
            renderCarrito();
        }
    };

    window.eliminarItem = function(nombre) {
        carrito = carrito.filter(i => i.nombre !== nombre);
        guardarCarrito();
        renderCarrito();
    };

    function renderCarrito() {
        itemsContainer.innerHTML = "";
        let total = 0;

        if (carrito.length === 0) {
            itemsContainer.innerHTML = "<p style='text-align: center; color: #777; margin-top: 50px;'>Tu carrito está vacío.</p>";
            totalElement.innerText = "$0,00";
            return;
        }

        carrito.forEach(item => {
            const subtotal = item.precioNum * item.cantidad;
            total += subtotal;

            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.gap = "15px";
            div.style.borderBottom = "1px solid #f9f9f9";
            div.style.paddingBottom = "15px";

            div.innerHTML = `
                <img src="${prefix}${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; font-family: 'Playfair Display', serif; color: var(--azul-marino); font-size: 0.95rem;">${item.nombre}</div>
                    <div style="color: var(--dorado); font-size: 0.85rem; margin-bottom: 8px;">${formatPrecio(item.precioNum)}</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="modificarCantidad('${item.nombre}', -1)" style="border: 1px solid #ccc; background: transparent; width: 25px; height: 25px; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center;">-</button>
                        <span style="font-size: 0.9rem; font-weight: bold;">${item.cantidad}</span>
                        <button onclick="modificarCantidad('${item.nombre}', 1)" style="border: 1px solid #ccc; background: transparent; width: 25px; height: 25px; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center;">+</button>
                    </div>
                </div>
                <button onclick="eliminarItem('${item.nombre}')" style="background: transparent; border: none; font-size: 1.2rem; color: #999; cursor: pointer; padding: 5px;">&times;</button>
            `;
            itemsContainer.appendChild(div);
        });

        totalElement.innerText = formatPrecio(total);
        actualizarBadges();
    }

    if(btnComprar) {
        btnComprar.addEventListener("click", function() {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Agrega una pieza antes de proceder al pago.");
                return;
            }
            
            // --- NUEVA LÓGICA DE WHATSAPP ---
            // 1. Aquí pones tu número (Recuerda: 569 para Chile)
            const numeroWhatsApp = '56986363492'; 
            
            // 2. Armamos el texto del mensaje leyendo los productos del carrito
            let mensaje = "Hola, me gustaria concretar la compra de los siguientes articulos:\n\n";
            let totalCarrito = 0;
            
            carrito.forEach(item => {
                const subtotal = item.precioNum * item.cantidad;
                totalCarrito += subtotal;
                mensaje += `- ${item.cantidad}x ${item.nombre} (${formatPrecio(subtotal)})\n`;
            });
            
            mensaje += `\n*Total a pagar: ${formatPrecio(totalCarrito)}*\n\nQuedo atento a las instrucciones para el pago y envio.`;
            
            // 3. Codificamos el texto y abrimos WhatsApp en otra pestaña
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, '_blank');
            
            // 4. Vaciamos el carrito (ya que la orden se envió por chat)
            carrito = [];
            guardarCarrito();
            renderCarrito();
            cerrarCarrito();
        });
    }

    const botones = document.querySelectorAll('button');
    botones.forEach(btn => {
        if(btn.innerText.toLowerCase().includes('carro') || btn.innerText.toLowerCase().includes('carrito')) {
            btn.addEventListener('click', function(e) {
                let card = e.target.closest('.reloj-card');
                let nombre, precioStr, img;

                if (card) {
                    nombre = card.querySelector('h3').innerText.trim();
                    const pTags = card.querySelectorAll('p');
                    pTags.forEach(p => { if(p.innerText.includes('$')) precioStr = p.innerText.trim(); });
                    
                    img = card.querySelector('img').getAttribute('src');
                    if (img.startsWith('../')) img = img.substring(3);
                } else {
                    const h1 = document.querySelector('h1');
                    if(h1) nombre = h1.innerText.trim();
                    const pTags = document.querySelectorAll('p');
                    pTags.forEach(p => { if(p.innerText.includes('$')) precioStr = p.innerText.trim(); });
                    const imgTag = document.querySelector('section img');
                    if(imgTag) {
                        img = imgTag.getAttribute('src');
                        if (img.startsWith('../')) img = img.substring(3);
                    }
                }

                if (nombre && precioStr && img) {
                    const precioNum = parsePrecio(precioStr);
                    const itemExistente = carrito.find(i => i.nombre === nombre);
                    if (itemExistente) {
                        itemExistente.cantidad++;
                    } else {
                        carrito.push({ nombre, precioNum, img, cantidad: 1 });
                    }
                    guardarCarrito();
                    abrirCarrito();
                    
                    const txtOriginal = btn.innerText;
                    btn.innerText = "¡AÑADIDO!";
                    btn.style.backgroundColor = "var(--dorado)";
                    setTimeout(() => {
                        btn.innerText = txtOriginal;
                        btn.style.backgroundColor = "";
                    }, 1500);
                }
            });
        }
    });
    
    // Inicializar el número en el icono al cargar la página
    actualizarBadges();
});
