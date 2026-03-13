const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

// Botun klasörleme mantığıyla %100 uyumlu hale getiren fonksiyon
function fixSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Boşlukları tire yap
        .replace(/[^\w\-]+/g, '')       // Özel karakterleri sil
        .replace(/\-\-+/g, '-')         // Çift tireleri tek yap
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
        list.innerHTML = mangalar.map(m => `
            <div class="manga-card" onclick="location.href='reader.html?manga=${fixSlug(m.slug || m.title)}&bolum=1'">
                <img src="${m.cover}" onerror="this.src='https://via.placeholder.com/200x300?text=Kapak+Yok'">
                <h3>${m.title}</h3>
            </div>`).join('');
    } catch(e) { console.error("Liste yüklenemedi"); }
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const slug = fixSlug(s);
    try {
        const url = `${BASE}/veriler/${slug}/bolum-${b}.json?v=${Date.now()}`;
        const r = await fetch(url);
        if(!r.ok) throw new Error("Dosya bulunamadı: " + url);
        const data = await r.json();
        container.innerHTML = data.images.map(img => `<img src="${img}" style="width:100%; display:block;">`).join('');
        
        document.getElementById('reader-nav').innerHTML = `
            <div class="nav-container">
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${Math.max(1, parseInt(b)-1)}'">⬅</button>
                <button onclick="location.href='index.html'">Ev</button>
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${parseInt(b)+1}'">➡</button>
            </div>`;
    } catch(e) {
        container.innerHTML = `<div style="color:white;text-align:center;padding:50px;">
            <h3>Bölüm Henüz Yüklenmemiş veya Hatalı</h3>
            <p style="font-size:10px; color:gray;">Hata: ${e.message}</p>
        </div>`;
    }
}
