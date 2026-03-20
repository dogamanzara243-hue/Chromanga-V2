
async function baslat() {
    try {
        const response = await fetch('manga-listesi.json');
        const data = await response.json();
        const container = document.getElementById('manga-grid');
        
        container.innerHTML = data.map(manga => `
            <div class="manga-card" onclick="location.href='detay.html?slug=${manga.slug}'">
                <img src="${manga.cover}" alt="${manga.title}" loading="lazy">
                <div class="info">
                    <h3>${manga.title}</h3>
                    <p class="desc">${manga.description || 'Hemen okumaya başla...'}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error("Veri yuklenemedi:", err);
    }
}
document.addEventListener('DOMContentLoaded', baslat);
