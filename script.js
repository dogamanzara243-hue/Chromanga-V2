
async function listele() {
    const res = await fetch('manga-listesi.json');
    const mangalar = await res.json();
    const grid = document.getElementById('manga-grid');

    grid.innerHTML = mangalar.map(manga => `
        <div class="manga-card" onclick="location.href='detay.html?slug=${manga.slug}'">
            <img src="${manga.cover}" alt="${manga.title}">
            <div class="info">
                <h3>${manga.title}</h3>
                <p>${manga.description || 'Hemen oku...'}</p>
            </div>
        </div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', listele);
