
const repoOwner = "dogamanzara243-hue";
const repoName = "Chromanga-V2";

async function fetchMangaList() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/manga-listesi.json?t=${new Date().getTime()}`);
        const data = await response.json();
        const grid = document.getElementById('manga-grid');
        if(!grid) return;
        grid.innerHTML = data.map(manga => `
            <div class="manga-card" onclick="location.href='detay.html?slug=${manga.slug}'">
                <img src="${manga.cover}" alt="${manga.title}" loading="lazy">
                <div class="manga-info">
                    <h3>${manga.title}</h3>
                    <p>Güncelleme: ${manga.updated || 'Yeni'}</p>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error("Liste yüklenemedi:", err); }
}

if (document.getElementById('manga-grid')) fetchMangaList();
