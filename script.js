
const GITHUB_USER = "dogamanzara243-hue";
const REPO = "Chromanga-V2";

window.onload = () => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('manga');
    const b = p.get('bolum');
    m && b ? loadReader(m, b) : loadHome();
};

async function loadHome() {
    const mangalar = ['solo-spell-caster']; // Buraya eklediğin mangaların sluglarını yaz
    const list = document.getElementById('manga-list');
    for(let s of mangalar) {
        const r = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/main/veriler/${s}/info.json`);
        const info = await r.json();
        list.innerHTML += `<div class="manga-card" onclick="location.href='reader.html?manga=${s}&bolum=1'"><img src="${info.cover}" style="width:100%"><p>${info.title}</p></div>`;
    }
}

async function loadReader(s, b) {
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/main/veriler/${s}/bolum-${b}.json`);
    const data = await res.json();
    document.getElementById('manga-title').innerText = `Bölüm ${b}`;
    const container = document.getElementById('image-container');
    data.images.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        container.appendChild(img);
    });
}
