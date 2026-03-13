
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
        const r = await fetch(BASE + "/manga-listesi.json");
        const mangalar = await r.json();
        window.allMangas = mangalar;
        renderMangas(mangalar);
        document.getElementById('mangaSearch').oninput = (e) => {
            const term = e.target.value.toLowerCase();
            renderMangas(window.allMangas.filter(m => m.title.toLowerCase().includes(term)));
        };
    } catch(e) { console.error(e); }
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
        const r = await fetch(BASE + "/veriler/" + s + "/bolum-" + b + ".json");
        const data = await r.json();
        container.innerHTML = data.images.map(u => '<img src="' + u + '" loading="lazy">').join('');
        addNav(s, bInt);
    } catch(e) { container.innerHTML = "<h3>Bölüm henüz yüklenmemiş!</h3>"; }
}

function addNav(s, b) {
    let nav = document.getElementById('reader-nav');
    if(!nav) { nav = document.createElement('div'); nav.id = 'reader-nav'; document.body.appendChild(nav); }
    let prev = b > 1 ? '<button onclick="location.href=\'reader.html?manga=' + s + '&bolum=' + (b-1) + '\'">⬅ Geri</button>' : '';
    let next = '<button onclick="location.href=\'reader.html?manga=' + s + '&bolum=' + (b+1) + '\'">İleri ➡</button>';
    let home = '<button onclick="location.href=\'index.html\'">Ev</button>';
    nav.innerHTML = '<div class="nav-container">' + prev + home + next + '</div>';
}
