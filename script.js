
const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

window.onload = () => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('manga');
    const b = p.get('bolum');
    m && b ? loadReader(m, b) : loadHome();
};

async function loadHome() {
    const list = document.getElementById('manga-list');
    if(!list) return;
    try {
        const r = await fetch(`${BASE}/manga-listesi.json`);
        const mangalar = await r.json();
        window.allMangas = mangalar;
        renderMangas(mangalar);
        
        document.getElementById('mangaSearch').oninput = (e) => {
            const term = e.target.value.toLowerCase();
            renderMangas(window.allMangas.filter(m => m.title.toLowerCase().includes(term)));
        };
    } catch(e) { console.error("Ana sayfa yükleme hatası:", e); }
}

function renderMangas(data) {
    const list = document.getElementById('manga-list');
    list.innerHTML = data.map(m => `
        <div class="manga-card" onclick="location.href='reader.html?manga=${m.slug}&bolum=1'">
            <img src="${m.cover}">
            <div class="manga-info">
                <h3>${m.title}</h3>
                <p class="manga-desc">${m.description || ''}</p>
            </div>
        </div>`).join('');
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const mangaSlug = s.toLowerCase().trim(); // Garantilemek için küçük harf yap
    document.getElementById('manga-title').innerText = `Bölüm ${b}`;

    try {
        const filePath = `${BASE}/veriler/${mangaSlug}/bolum-${b}.json`;
        console.log("Dosya aranıyor:", filePath); // Tarayıcı konsolunda kontrol et
        
        const r = await fetch(filePath);
        if (!r.ok) throw new Error("Dosya bulunamadı");
        
        const data = await r.json();
        container.innerHTML = data.images.map(u => `<img src="${u}" loading="lazy">`).join('');
        addNav(mangaSlug, parseInt(b));
    } catch(e) {
        container.innerHTML = `<div style="text-align:center;padding:100px;"><h3>Bölüm henüz işleniyor veya bulunamadı.</h3><p>Hata: ${e.message}</p></div>`;
    }
}

function addNav(s, b) {
    let nav = document.getElementById('reader-nav');
    if(!nav) { nav = document.createElement('div'); nav.id = 'reader-nav'; document.body.appendChild(nav); }
    nav.innerHTML = `
        <div class="nav-container">
            ${b > 1 ? `<button onclick="location.href='reader.html?manga=${s}&bolum=${b-1}'">⬅ Geri</button>` : ''}
            <button onclick="location.href='index.html'">Ev</button>
            <button onclick="location.href='reader.html?manga=${s}&bolum=${b+1}'">İleri ➡</button>
        </div>`;
}
