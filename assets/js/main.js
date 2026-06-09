/* ==========================================================
   MAIN.JS - Scripts del sitio
   Nexus Prime | Yusef Haitak Martínez
   ----------------------------------------------------------
   1. Menú hamburguesa
   2. Validación del formulario de contacto
   3. Filtrado del catálogo de la tienda
   4. Ficha de producto dinámica (datos y galería)
   ========================================================== */


/* ==========================================================
   1. MENÚ HAMBURGUESA
   ========================================================== */
(function () {

    const boton = document.querySelector('.menu-hamburguesa');
    const menu = document.getElementById('nav-links');

    // Si la página no tiene navbar, no se ejecuta nada
    if (!boton || !menu) {
        return;
    }

    // Abrir / cerrar el menú al pulsar el botón
    boton.addEventListener('click', function () {
        const abierto = menu.classList.toggle('activo');
        boton.setAttribute('aria-expanded', abierto);
    });

    // Cerrar el menú al pulsar cualquiera de sus enlaces
    menu.querySelectorAll('a').forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            menu.classList.remove('activo');
            boton.setAttribute('aria-expanded', 'false');
        });
    });

})();


/* ==========================================================
   2. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   ========================================================== */
(function () {

    const formulario = document.getElementById('form-contacto');
    const confirmacion = document.getElementById('confirmacion');

    // Si la página no tiene el formulario, no se ejecuta nada
    if (!formulario || !confirmacion) {
        return;
    }

    // Expresión regular para validar el formato del correo electrónico
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Muestra un mensaje de error debajo de un campo
    function mostrarError(campo, texto) {
        campo.classList.add('invalido');
        const error = document.createElement('span');
        error.className = 'campo-error';
        error.textContent = texto;
        campo.parentElement.appendChild(error);
    }

    // Borra los errores de una validación anterior
    function limpiarErrores() {
        formulario.querySelectorAll('.campo-error').forEach(function (e) {
            e.remove();
        });
        formulario.querySelectorAll('.invalido').forEach(function (c) {
            c.classList.remove('invalido');
        });
    }

    formulario.addEventListener('submit', function (evento) {

        // Se cancela el envío para validar primero en el cliente
        evento.preventDefault();
        limpiarErrores();

        let valido = true;

        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const departamento = document.getElementById('departamento');
        const mensaje = document.getElementById('mensaje');
        const politicas = document.getElementById('politicas');

        // Nombre: obligatorio
        if (nombre.value.trim() === '') {
            mostrarError(nombre, 'Indica tu nombre y apellidos.');
            valido = false;
        }

        // Email: obligatorio y con formato válido
        if (email.value.trim() === '') {
            mostrarError(email, 'Indica tu correo electrónico.');
            valido = false;
        } else if (!patronEmail.test(email.value.trim())) {
            mostrarError(email, 'El formato del correo no es válido.');
            valido = false;
        }

        // Departamento: debe seleccionarse una opción
        if (departamento.value === '') {
            mostrarError(departamento, 'Selecciona el motivo de la consulta.');
            valido = false;
        }

        // Mensaje: obligatorio
        if (mensaje.value.trim() === '') {
            mostrarError(mensaje, 'Escribe tu mensaje.');
            valido = false;
        }

        // Políticas: la casilla debe estar marcada
        if (!politicas.checked) {
            mostrarError(politicas, 'Debes aceptar la Política de privacidad.');
            valido = false;
        }

        // Si todo es correcto, se oculta el formulario y se muestra
        // el mensaje de confirmación con el número de ticket
        if (valido) {
            formulario.hidden = true;
            confirmacion.hidden = false;
            confirmacion.scrollIntoView({ behavior: 'smooth' });
        }

    });

})();


/* ==========================================================
   3. FILTRADO DEL CATÁLOGO DE LA TIENDA
   ========================================================== */
(function () {

    const busqueda = document.getElementById('busqueda');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroMarca = document.getElementById('filtro-marca');
    const sinResultados = document.getElementById('sin-resultados');
    const productos = document.querySelectorAll('.tarjeta-producto');

    // Si la página no es la tienda, no se ejecuta nada
    if (!busqueda || !filtroCategoria || !filtroMarca) {
        return;
    }

    // Recorre los productos y muestra solo los que cumplen los tres filtros
    function filtrar() {

        const texto = busqueda.value.trim().toLowerCase();
        const categoria = filtroCategoria.value;
        const marca = filtroMarca.value;
        let visibles = 0;

        productos.forEach(function (producto) {

            const nombre = producto.querySelector('h3').textContent.toLowerCase();

            // Cada condición se cumple si el filtro está en "todas"
            // o si el dato del producto coincide con lo seleccionado
            const coincideTexto = nombre.includes(texto);
            const coincideCategoria = (categoria === 'todas') ||
                (producto.dataset.categoria === categoria);
            const coincideMarca = (marca === 'todas') ||
                (producto.dataset.marca === marca);

            if (coincideTexto && coincideCategoria && coincideMarca) {
                producto.hidden = false;
                visibles++;
            } else {
                producto.hidden = true;
            }
        });

        // Muestra el mensaje de aviso si ningún producto ha quedado visible
        sinResultados.hidden = (visibles > 0);
    }

    // El filtrado se ejecuta cada vez que cambia cualquiera de los controles
    busqueda.addEventListener('input', filtrar);
    filtroCategoria.addEventListener('change', filtrar);
    filtroMarca.addEventListener('change', filtrar);

})();


/* ==========================================================
   4. FICHA DE PRODUCTO DINÁMICA (datos y galería)
   ========================================================== */
(function () {

    const ficha = document.getElementById('ficha-producto');

    // Si la página no es la ficha dinámica, no se ejecuta nada
    if (!ficha) {
        return;
    }

    // Catálogo de productos. Cada clave es el identificador que viaja
    // en la URL (det_productos.html?id=clave). El array "imagenes"
    // contiene la imagen principal y las dos adicionales de la galería.
    const catalogo = {
        'servidor-dell': {
            categoria: 'Servidores',
            nombre: 'Servidor de torre Dell PowerEdge',
            referencia: 'NXP-SRV-DELL-0142',
            precioBase: '1.032,23 €',
            precioIva: '1.249,00 € IVA incluido',
            stock: 'disponible',
            stockTexto: 'En stock — envío en 24h',
            imagenes: [
                'img/productos/servidor-1.webp',
                'img/productos/servidor-2.webp',
                'img/productos/servidor-3.webp'
            ],
            descripcion: 'Servidor de torre orientado a pequeñas y medianas empresas. Equilibra rendimiento, capacidad de ampliación y bajo nivel sonoro, ideal como primer servidor corporativo.',
            especificaciones: [
                ['Procesador', 'Intel Xeon E-2314, 4 núcleos a 2,8 GHz'],
                ['Memoria RAM', '16 GB DDR4 ECC (ampliable hasta 128 GB)'],
                ['Almacenamiento', '2 x 1 TB SATA en configuración RAID 1'],
                ['Red', '2 puertos Gigabit Ethernet'],
                ['Sistema operativo', 'Compatible con Windows Server y Linux'],
                ['Garantía', '3 años con asistencia in situ']
            ]
        },
        'firewall-cisco': {
            categoria: 'Redes',
            nombre: 'Firewall perimetral Cisco',
            referencia: 'NXP-FW-CISCO-0210',
            precioBase: '726,45 €',
            precioIva: '879,00 € IVA incluido',
            stock: 'disponible',
            stockTexto: 'En stock — envío en 24h',
            imagenes: [
                'img/productos/firewall-1.webp',
                'img/productos/firewall-2.webp',
                'img/productos/firewall-3.webp'
            ],
            descripcion: 'Appliance de seguridad perimetral para la protección de redes corporativas. Filtrado de tráfico avanzado y gestión centralizada de políticas de seguridad.',
            especificaciones: [
                ['Rendimiento', 'Hasta 1 Gbps de inspección de tráfico'],
                ['Puertos', '8 puertos Gigabit Ethernet'],
                ['VPN', 'Soporte para VPN site-to-site y de acceso remoto'],
                ['Gestión', 'Panel de administración web centralizado'],
                ['Garantía', '3 años con sustitución anticipada']
            ]
        },
        'workstation-hp': {
            categoria: 'Puestos de trabajo',
            nombre: 'Workstation HP Z2',
            referencia: 'NXP-WS-HP-0335',
            precioBase: '908,26 €',
            precioIva: '1.099,00 € IVA incluido',
            stock: 'pedido',
            stockTexto: 'Bajo pedido — entrega en 5 días',
            imagenes: [
                'img/productos/workstation-1.webp',
                'img/productos/workstation-2.webp',
                'img/productos/workstation-3.webp'
            ],
            descripcion: 'Estación de trabajo profesional para tareas exigentes de diseño, cálculo y desarrollo. Equilibra potencia y fiabilidad para entornos de producción.',
            especificaciones: [
                ['Procesador', 'Intel Core i7, 8 núcleos'],
                ['Memoria RAM', '32 GB DDR5'],
                ['Almacenamiento', 'SSD NVMe de 1 TB'],
                ['Gráfica', 'Tarjeta gráfica profesional dedicada'],
                ['Garantía', '3 años in situ']
            ]
        },
        'switch-cisco': {
            categoria: 'Redes',
            nombre: 'Switch gestionado Cisco 24 puertos',
            referencia: 'NXP-SW-CISCO-0418',
            precioBase: '379,34 €',
            precioIva: '459,00 € IVA incluido',
            stock: 'disponible',
            stockTexto: 'En stock — envío en 24h',
            imagenes: [
                'img/productos/switch-1.webp',
                'img/productos/switch-2.webp',
                'img/productos/switch-3.webp'
            ],
            descripcion: 'Conmutador gestionado de 24 puertos para redes corporativas. Permite la segmentación en VLAN y la priorización del tráfico de red.',
            especificaciones: [
                ['Puertos', '24 puertos Gigabit Ethernet'],
                ['Gestión', 'Configuración de VLAN y QoS'],
                ['Capacidad', 'Conmutación a velocidad de cable'],
                ['Formato', 'Montaje en rack de 19 pulgadas'],
                ['Garantía', '3 años']
            ]
        },
        'nas-synology': {
            categoria: 'Almacenamiento',
            nombre: 'Servidor NAS Synology',
            referencia: 'NXP-NAS-SYN-0502',
            precioBase: '528,10 €',
            precioIva: '639,00 € IVA incluido',
            stock: 'disponible',
            stockTexto: 'En stock — envío en 24h',
            imagenes: [
                'img/productos/nas-1.webp',
                'img/productos/nas-2.webp',
                'img/productos/nas-3.webp'
            ],
            descripcion: 'Sistema de almacenamiento en red para copias de seguridad y archivos compartidos. Centraliza los datos de la empresa de forma segura y accesible.',
            especificaciones: [
                ['Bahías', '4 bahías para discos de 3,5"'],
                ['Capacidad máxima', 'Hasta 64 TB'],
                ['RAID', 'Soporte para RAID 0, 1, 5, 6 y 10'],
                ['Red', '2 puertos Gigabit Ethernet'],
                ['Garantía', '2 años']
            ]
        },
        'servidor-hp': {
            categoria: 'Servidores',
            nombre: 'Servidor en rack HP ProLiant',
            referencia: 'NXP-SRV-HP-0617',
            precioBase: '1.561,98 €',
            precioIva: '1.890,00 € IVA incluido',
            stock: 'agotado',
            stockTexto: 'Agotado temporalmente',
            imagenes: [
                'img/productos/servidor-rack-1.webp',
                'img/productos/servidor-rack-2.webp',
                'img/productos/servidor-rack-3.webp'
            ],
            descripcion: 'Servidor en formato rack para centros de datos y entornos de virtualización. Diseñado para cargas de trabajo intensivas y alta disponibilidad.',
            especificaciones: [
                ['Procesador', 'Intel Xeon Silver, 12 núcleos'],
                ['Memoria RAM', '64 GB DDR4 ECC'],
                ['Almacenamiento', '4 x 2 TB SAS en RAID 10'],
                ['Formato', 'Rack 2U'],
                ['Garantía', '3 años con asistencia in situ']
            ]
        },
        'sobremesa-dell': {
            categoria: 'Puestos de trabajo',
            nombre: 'Equipo de sobremesa Dell OptiPlex',
            referencia: 'NXP-PC-DELL-0723',
            precioBase: '619,01 €',
            precioIva: '749,00 € IVA incluido',
            stock: 'disponible',
            stockTexto: 'En stock — envío en 24h',
            imagenes: [
                'img/productos/sobremesa-1.webp',
                'img/productos/sobremesa-2.webp',
                'img/productos/sobremesa-3.webp'
            ],
            descripcion: 'Equipo de sobremesa para puestos de oficina. Fiable y eficiente para tareas administrativas y ofimática en el día a día de la empresa.',
            especificaciones: [
                ['Procesador', 'Intel Core i5, 6 núcleos'],
                ['Memoria RAM', '16 GB DDR4'],
                ['Almacenamiento', 'SSD de 512 GB'],
                ['Sistema operativo', 'Windows 11 Pro'],
                ['Garantía', '3 años']
            ]
        },
        'cabina-synology': {
            categoria: 'Almacenamiento',
            nombre: 'Cabina de almacenamiento Synology',
            referencia: 'NXP-CAB-SYN-0834',
            precioBase: '1.090,91 €',
            precioIva: '1.320,00 € IVA incluido',
            stock: 'pedido',
            stockTexto: 'Bajo pedido — entrega en 5 días',
            imagenes: [
                'img/productos/cabina-1.webp',
                'img/productos/cabina-2.webp',
                'img/productos/cabina-3.webp'
            ],
            descripcion: 'Cabina de almacenamiento de alta capacidad para entornos que requieren gran volumen de datos y políticas de copia de seguridad robustas.',
            especificaciones: [
                ['Bahías', '8 bahías para discos de 3,5"'],
                ['Capacidad máxima', 'Hasta 128 TB'],
                ['RAID', 'Soporte para RAID 0, 1, 5, 6 y 10'],
                ['Red', '4 puertos Gigabit Ethernet'],
                ['Garantía', '3 años']
            ]
        }
    };

    // Lee el identificador del producto desde la URL (?id=...)
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');

    // Selecciona el producto pedido; si no existe o no se indica
    // ninguno, se muestra el primero como valor por defecto
    const producto = catalogo[id] || catalogo['servidor-dell'];

    // --- Datos de texto ---
    document.title = producto.nombre + ' | Nexus Prime';
    document.getElementById('producto-categoria').textContent = producto.categoria;
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-miga').textContent = producto.nombre;
    document.getElementById('producto-referencia').textContent = 'Referencia: ' + producto.referencia;
    document.getElementById('producto-precio-base').textContent = producto.precioBase;
    document.getElementById('producto-precio-iva').textContent = producto.precioIva;
    document.getElementById('producto-descripcion').textContent = producto.descripcion;

    // Indicador de stock: texto y clase de color
    const stock = document.getElementById('producto-stock');
    stock.textContent = producto.stockTexto;
    stock.className = 'producto-stock stock-' + producto.stock;

    // --- Tabla de especificaciones ---
    const tabla = document.getElementById('producto-especificaciones');
    producto.especificaciones.forEach(function (fila) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');
        th.scope = 'row';
        th.textContent = fila[0];
        td.textContent = fila[1];
        tr.appendChild(th);
        tr.appendChild(td);
        tabla.appendChild(tr);
    });

    // --- Galería de imágenes ---
    const principal = document.getElementById('producto-imagen');
    const contenedorMiniaturas = document.getElementById('producto-miniaturas');

    // La imagen principal arranca mostrando la primera del array
    principal.src = producto.imagenes[0];
    principal.alt = producto.nombre;

    // Se genera una miniatura por cada imagen del producto
    producto.imagenes.forEach(function (ruta, indice) {

        const boton = document.createElement('button');
        boton.className = 'miniatura';
        boton.setAttribute('aria-label', 'Ver imagen ' + (indice + 1) + ' de ' + producto.nombre);

        // La primera miniatura aparece marcada como activa
        if (indice === 0) {
            boton.classList.add('activa');
        }

        const img = document.createElement('img');
        img.src = ruta;
        img.alt = producto.nombre + ' - imagen ' + (indice + 1);
        boton.appendChild(img);

        // Al pulsar una miniatura, su imagen pasa a ser la principal
        boton.addEventListener('click', function () {
            principal.src = ruta;

            // Se actualiza la miniatura marcada como activa
            contenedorMiniaturas.querySelectorAll('.miniatura').forEach(function (m) {
                m.classList.remove('activa');
            });
            boton.classList.add('activa');
        });

        contenedorMiniaturas.appendChild(boton);
    });

})();