const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

// Botun klasörleme mantığıyla %100 uyumlu (Küçük harf ve tire)
function toSlug(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
        const data = await r.json();
        list.innerHTML = data.map(m => `
            <div class="manga-card" onclick="location.href='reader.html?manga=${toSlug(m.slug || m.title)}&bolum=1'">
                <img src="${m.cover}" onerror="this.src='https://via.placeholder.com/200x300?text=Kapak+Yok'">
                <h3>${m.title}</h3>
            </div>`).join('');
    } catch(e) { console.error("Liste yüklenemedi"); }
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const slug = toSlug(s);
    try {
        const url = `${BASE}/veriler/${slug}/bolum-${b}.json?v=${Date.now()}`;
        const r = await fetch(url);
        if(!r.ok) throw new Error("Dosya bulunamadı");
        
        const data = await r.json();
        container.innerHTML = data.images.map(img => `<img src="${img}" style="width:100%; display:block;">`).join('');
        
        // Navigasyon
        document.getElementById('reader-nav').innerHTML = `
            <div style="text-align:center; padding:20px; background:#000;">
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${Math.max(1, parseInt(b)-1)}'">Geri</button>
                <button onclick="location.href='index.html'">Ev</button>
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${parseInt(b)+1}'">İleri</button>
            </div>`;
    } catch(e) {
        container.innerHTML = `<div style="color:white;text-align:center;padding:100px;">
            <h2>Bölüm Yüklenemedi</h2>
            <p>Lütfen botun bölümü yüklediğinden emin olun.</p>
        </div>`;
    }
        }
