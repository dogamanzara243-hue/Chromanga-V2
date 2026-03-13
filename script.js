const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

// İsimleri botun formatına (küçük harf ve tire) çeviren sihirli fonksiyon
function formatSlug(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9 ]/g, '') // Özel karakterleri sil
        .replace(/\s+/g, '-')       // Boşlukları tire yap
        .trim();
}

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
        const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
        const mangalar = await r.json();
        window.allMangas = mangalar;
        renderMangas(mangalar);
    } catch(e) { console.error("Liste yüklenemedi"); }
}

function renderMangas(data) {
    const list = document.getElementById('manga-list');
    list.innerHTML = data.map(m => `
        <div class="manga-card" onclick="location.href='reader.html?manga=${formatSlug(m.slug || m.title)}&bolum=1'">
            <img src="${m.cover}">
            <div class="manga-info">
                <h3>${m.title}</h3>
            </div>
        </div>`).join('');
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const slug = formatSlug(s); // Kullanıcı ne girerse girsin botun formatına çevir
    
    try {
        const res = await fetch(`${BASE}/veriler/${slug}/bolum-${b}.json?v=${Date.now()}`);
        if (!res.ok) throw new Error("Dosya yok");
        const data = await res.json();
        container.innerHTML = data.images.map(u => `<img src="${u}" style="width:100%; display:block;">`).join('');
    } catch(e) {
        container.innerHTML = `<div style="color:white; text-align:center; padding:50px;">
            <h2>Bölüm Bulunamadı</h2>
            <p>Aranan Klasör: <b>veriler/${slug}</b></p>
            <a href="index.html" style="color:red;">Ana Sayfaya Dön</a>
        </div>`;
    }
}
