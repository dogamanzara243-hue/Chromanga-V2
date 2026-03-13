
const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";
const BASE = "https://raw.githubusercontent.com/" + USER + "/" + REPO + "/main";

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
        const r = await fetch(BASE + "/manga-listesi.json?v=" + Date.now());
        const data = await r.json();
        window.allMangas = data;
        renderMangas(data);
        document.getElementById('mangaSearch').oninput = (e) => {
            const term = e.target.value.toLowerCase();
            renderMangas(window.allMangas.filter(m => m.title.toLowerCase().includes(term)));
        };
    } catch(e) { list.innerHTML = "<h3>Manga listesi yüklenemedi!</h3>"; }
}

function renderMangas(data) {
    const list = document.getElementById('manga-list');
    list.innerHTML = data.map(m => '<div class="manga-card" onclick="location.href=\'reader.html?manga=' + m.slug + '&bolum=1\'"><img src="' + m.cover + '"><h3>' + m.title + '</h3></div>').join('');
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const bInt = parseInt(b);
    document.getElementById('manga-title').innerText = "Bölüm " + b;
    try {
        const r = await fetch(BASE + "/veriler/" + s + "/bolum-" + b + ".json?v=" + Date.now());
        if(!r.ok) throw new Error();
        const data = await r.json();
        container.innerHTML = data.images.map(u => '<img src="' + u + '" loading="lazy">').join('');
        
        let nav = document.getElementById('reader-nav');
        nav.innerHTML = (bInt > 1 ? '<button onclick="location.href=\'reader.html?manga=' + s + '&bolum=' + (bInt-1) + '\'">⬅ Geri</button>' : '') +
                        '<button onclick="location.href=\'index.html\'">Ev</button>' +
                        '<button onclick="location.href=\'reader.html?manga=' + s + '&bolum=' + (bInt+1) + '\'">İleri ➡</button>';
    } catch(e) {
        container.innerHTML = "<div style='text-align:center;padding:100px;'><h3>Bölüm henüz eklenmemiş!</h3><a href='index.html' style='color:red'>Ana Sayfaya Dön</a></div>";
    }
}
