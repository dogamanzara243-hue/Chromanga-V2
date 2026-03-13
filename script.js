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
        const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
        const mangalar = await r.json();
        list.innerHTML = mangalar.map(m => `
            <div class="manga-card" onclick="location.href='reader.html?manga=${m.slug}&bolum=1'">
                <img src="${m.cover}">
                <h3>${m.title}</h3>
            </div>`).join('');
    } catch(e) { console.log("Liste henüz oluşmamış."); }
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    try {
        const r = await fetch(`${BASE}/veriler/${s}/bolum-${b}.json?v=${Date.now()}`);
        const data = await r.json();
        container.innerHTML = data.images.map(img => `<img src="${img}" style="width:100%;display:block;">`).join('');
        document.getElementById('reader-nav').innerHTML = `
            <div style="text-align:center;padding:20px;">
                <button onclick="location.href='reader.html?manga=${s}&bolum=${parseInt(b)-1}'">Geri</button>
                <button onclick="location.href='index.html'">Ev</button>
                <button onclick="location.href='reader.html?manga=${s}&bolum=${parseInt(b)+1}'">İleri</button>
            </div>`;
    } catch(e) { container.innerHTML = "<h2 style='color:white;text-align:center;'>Bölüm Yükleniyor... Lütfen bekleyin.</h2>"; }
}
