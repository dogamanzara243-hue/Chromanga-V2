
const slug = new URLSearchParams(window.location.search).get('slug');

async function detayYukle() {
    const res = await fetch('manga-listesi.json');
    const mangalar = await res.json();
    const manga = mangalar.find(m => m.slug === slug);

    if(manga) {
        document.title = `${manga.title} - Chromanga-V2`;
        document.getElementById('manga-baslik').innerText = manga.title;
        document.getElementById('manga-ozet').innerText = manga.description;
        document.getElementById('manga-kapak').src = manga.cover;
        if(document.getElementById('blur-bg')) document.getElementById('blur-bg').style.backgroundImage = `url(${manga.cover})`;
    }

    const liste = document.getElementById('bolum-listesi');
    // Bolumleri dinamik kontrol et
    for(let i=1; i<=200; i++) {
        const check = await fetch(`veriler/${slug}/bolum-${i}.json`);
        if(check.ok) {
            liste.innerHTML += `<a href="okuyucu.html?slug=${slug}&bolum=${i}" class="bolum-item">Bölüm ${i}</a>`;
        } else if (i > 10) break;
    }
}
document.addEventListener('DOMContentLoaded', detayYukle);
