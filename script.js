document.addEventListener("DOMContentLoaded", () => {
    // Buscar los datos en el archivo JSON
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            
            // 1. Cargar estadísticas en el Inicio (si estamos en index.html)
            if (document.getElementById('stat-inflacion')) {
                document.getElementById('stat-inflacion').textContent = data.estadisticas.inflacion_mensual;
                document.getElementById('stat-actividad').textContent = data.estadisticas.actividad_economica;
                document.getElementById('stat-recaudacion').textContent = data.estadisticas.recaudacion;
            }

            // 2. Cargar publicaciones y gráficos (si estamos en publicaciones.html)
            const contenedorPubs = document.getElementById('contenedor-publicaciones');
            if (contenedorPubs) {
                contenedorPubs.innerHTML = ''; // Limpiar mensaje de "Cargando"

                data.publicaciones.forEach(pub => {
                    // Crear estructura HTML para cada publicación
                    const article = document.createElement('article');
                    article.className = 'publicacion-card';
                    
                    article.innerHTML = `
                        <div class="texto-pub">
                            <h3>${pub.titulo}</h3>
                            <span class="fecha">${pub.fecha}</span>
                            <p>${pub.texto}</p>
                        </div>
                        <div class="grafico-pub">
                            <canvas id="grafico-${pub.id}"></canvas>
                        </div>
                    `;
                    contenedorPubs.appendChild(article);

                    // Dibujar el gráfico con Chart.js
                    const ctx = document.getElementById(`grafico-${pub.id}`).getContext('2d');
                    new Chart(ctx, {
                        type: 'bar', // Puede ser 'line', 'bar', 'pie'
                        data: {
                            labels: pub.grafico_etiquetas,
                            datasets: [{
                                label: 'Evolución',
                                data: pub.grafico_valores,
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }
                    });
                });
            }
        })
        .catch(error => console.error("Error cargando los datos:", error));
});