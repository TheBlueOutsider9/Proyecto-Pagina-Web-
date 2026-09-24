document.addEventListener("DOMContentLoaded", function() {
    const inventarioRelojes = [
        { nombre: "Classic Gold", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", url: "productos/producto-classic.html", precio: "$259,00" },
        { nombre: "Noir Heritage", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80", url: "productos/producto-noir.html", precio: "$239,00" },
        { nombre: "Silver Master", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&q=80", url: "productos/producto-silver.html", precio: "$399,00" },
        { nombre: "Vintage Leather", img: "https://images.unsplash.com/photo-1587836173083-294b059e09d5?w=400&q=80", url: "productos/producto-vintage.html", precio: "$199,00" },
        { nombre: "Chrono Sport", img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&q=80", url: "productos/producto-chrono.html", precio: "$315,00" },
        { nombre: "Diamond Elite", img: "https://images.unsplash.com/photo-1508656937213-333e66487e41?w=400&q=80", url: "productos/producto-diamond.html", precio: "$550,00" }
    ];

    const isInProductos = window.location.pathname.includes('/productos/');
    const prefix = isInProductos ? '../' : '';

    const overlay = document.createElement("div");
    overlay.id = "overlay-buscador";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 0.97)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.zIndex = "9999";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.paddingTop = "10vh";
    overlay.style.overflowY = "auto";

    overlay.innerHTML = `
        <span id="cerrar-buscador" style="position: absolute; top: 30px; right: 50px; font-size: 3rem; cursor: pointer; color: #132032; line-height: 1;">&times;</span>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #132032; margin-bottom: 30px;">Descubrir Piezas</h2>
        <input type="text" id="input-buscador-overlay" placeholder="Buscar por nombre, ej. Classic..." autocomplete="off" style="width: 80%; max-width: 600px; padding: 15px 20px; font-size: 1.5rem; border: none; border-bottom: 2px solid #CFA76B; background: transparent; outline: none; text-align: center; font-family: 'Montserrat', sans-serif; color: #132032;">
        <div id="resultados-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 40px; width: 90%; max-width: 1200px; margin-top: 60px; padding-bottom: 60px;"></div>
    `;

    document.body.appendChild(overlay);

    const inputOverlay = document.getElementById("input-buscador-overlay");
    const grid = document.getElementById("resultados-grid");
    const btnAbrir = document.getElementById("abrir-buscador");
    const btnCerrar = document.getElementById("cerrar-buscador");

    let resultadosActuales = [];

    if(btnAbrir) {
        btnAbrir.addEventListener("click", function() {
            overlay.style.display = "flex";
            inputOverlay.value = "";
            grid.innerHTML = "";
            setTimeout(() => inputOverlay.focus(), 100);
            document.body.style.overflow = "hidden";
        });
    }

    if(btnCerrar) {
        btnCerrar.addEventListener("click", function() {
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    if(inputOverlay) {
        inputOverlay.addEventListener("input", function() {
            const query = this.value.toLowerCase().trim();
            grid.innerHTML = "";
            
            if (query.length === 0) {
                resultadosActuales = [];
                return;
            }

            resultadosActuales = inventarioRelojes.filter(r => r.nombre.toLowerCase().includes(query));
            
            if (resultadosActuales.length > 0) {
                resultadosActuales.forEach(reloj => {
                    const card = document.createElement("a");
                    card.href = prefix + reloj.url;
                    card.style.textDecoration = "none";
                    card.style.color = "inherit";
                    card.style.display = "flex";
                    card.style.flexDirection = "column";
                    card.style.alignItems = "center";
                    card.style.textAlign = "center";
                    card.style.padding = "20px";
                    card.style.border = "1px solid #f0f0f0";
                    card.style.borderRadius = "8px";
                    card.style.backgroundColor = "#fff";
                    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
                    
                    card.onmouseover = () => {
                        card.style.transform = "translateY(-5px)";
                        card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
                    };
                    card.onmouseout = () => {
                        card.style.transform = "translateY(0)";
                        card.style.boxShadow = "none";
                    };

                    card.innerHTML = `
                        <img src="${prefix}${reloj.img}" alt="${reloj.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 15px;">
                        <div style="font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #132032; margin-bottom: 5px;">${reloj.nombre}</div>
                        <div style="color: #CFA76B; font-weight: 500;">${reloj.precio}</div>
                    `;
                    grid.appendChild(card);
                });
            } else {
                grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #777; font-size: 1.1rem; padding: 40px;">No encontramos ninguna pieza con ese nombre.</div>`;
            }
        });

        inputOverlay.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                if (resultadosActuales.length > 0) {
                    window.location.href = prefix + resultadosActuales[0].url;
                }
            }
        });
    }
    
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && overlay.style.display === "flex") {
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
});
