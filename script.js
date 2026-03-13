const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('manga');
    const b = params.get('bolum');
    if (m && b) loadReader(m, b); else loadHome();
};

async function loadHome() {
    const list = document.getElementById('manga-list');
    if (!list) return;
    try {
        const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
        const data = await r.json();
        list.innerHTML = data.map(m => `
            <div class="manga-card" onclick="location.href='reader.html?manga=${m.slug}&bolum=1'">
                <img src="${m.cover}">
                <h3>${m.title}</h3>
            </div>`).join('');
    } catch (e) { console.error("Liste yüklenemedi"); }
}

async function loadReader(manga, bolum) {
    const container = document.getElementById('image-container');
    const slug = manga.toLowerCase().trim();
    // ÖNEMLİ: URL'yi doğru oluşturduğumuzdan emin oluyoruz
    const url = `${BASE}/veriler/${slug}/bolum-${bolum}.json?v=${Date.now()}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Dosya bulunamadı");
        const data = await res.json();
        
        // Resimleri basıyoruz
        container.innerHTML = data.images.map(img => 
            `<img src="${img}" style="width:100%; display:block; margin:0 auto;">`
        ).join('');

        // Alt navigasyon
        let nav = document.getElementById('reader-nav') || document.createElement('div');
        nav.id = 'reader-nav'; document.body.appendChild(nav);
        nav.innerHTML = `
            <div style="position:fixed; bottom:0; width:100%; background:#000; padding:15px; text-align:center;">
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${parseInt(bolum)-1}'">Geri</button>
                <button onclick="location.href='index.html'">Ev</button>
                <button onclick="location.href='reader.html?manga=${slug}&bolum=${parseInt(bolum)+1}'">İleri</button>
            </div>`;
    } catch (e) {
        container.innerHTML = `<div style="color:white;text-align:center;padding:100px;">
            <h3>Resimler Yüklenemedi!</h3>
            <p>Aranan dosya: <b>veriler/${slug}/bolum-${bolum}.json</b></p>
            <p>GitHub bu dosyayı henüz onaylamamış olabilir (1 dk bekleyin).</p>
        </div>`;
    }
}
