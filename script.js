
const jsonUrl = "manga-listesi.json";

async function yukle() {
    const res = await fetch(jsonUrl + "?v=" + Date.now());
    const veriler = await res.json();
    const grid = document.getElementById('manga-grid');
    grid.innerHTML = "";

    veriler.forEach(manga => {
        const div = document.createElement('div');
        div.className = "manga-card";
        div.innerHTML = `<img src="${manga.cover}"><h3>${manga.title}</h3>`;
        div.onclick = () => bolumSec(manga);
        grid.appendChild(div);
    });
}

function bolumSec(manga) {
    const bolum = prompt("Hangi bölüm? (Örn: bolum-1)");
    if(manga.bolumler[bolum]) {
        okuyucuBaslat(manga.bolumler[bolum]);
    }
}

async function okuyucuBaslat(zipUrl) {
    document.getElementById('reader-modal').style.display = "block";
    const reader = document.getElementById('manga-reader');
    reader.innerHTML = "Hazırlanıyor...";
    
    const resp = await fetch(zipUrl);
    const data = await resp.arrayBuffer();
    const zip = await JSZip.loadAsync(data);
    
    const imgs = [];
    zip.forEach((path, file) => { if(!file.dir) imgs.push(file); });
    imgs.sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true}));
    
    reader.innerHTML = "";
    for(let f of imgs) {
        const b = await f.async("blob");
        const img = document.createElement('img');
        img.src = URL.createObjectURL(b);
        reader.appendChild(img);
    }
}

function kapat() { document.getElementById('reader-modal').style.display = "none"; }
window.onload = yukle;
