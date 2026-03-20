
async function anaSayfaYukle() {
    const res = await fetch('manga-listesi.json');
    const mangalar = await res.json();
    const grid = document.getElementById('manga-grid');
    
    grid.innerHTML = mangalar.map(manga => `
        <div class="manga-card" onclick="location.href='detay.html?slug=${manga.slug}'">
            <img src="${manga.cover}" alt="${manga.title}" onerror="this.src='https://via.placeholder.com/300x450?text=Kapak+Yok'">
            <div class="info">
                <h3>${manga.title}</h3>
                <p class="desc">${manga.description || 'Hemen okumaya başla...'}</p>
            </div>
        </div>
    `).join('');
}
document.addEventListener('DOMContentLoaded', anaSayfaYukle);
