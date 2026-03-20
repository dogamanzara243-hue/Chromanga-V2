
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

async function detayYukle() {
    const res = await fetch('manga-listesi.json');
    const mangalar = await res.json();
    const manga = mangalar.find(m => m.slug === slug);

    if(manga) {
        document.getElementById('manga-baslik').innerText = manga.title;
        document.getElementById('manga-ozet').innerText = manga.description;
        document.getElementById('manga-kapak').src = manga.cover;
        document.getElementById('blur-bg').style.backgroundImage = `url(${manga.cover})`;
    }

    const liste = document.getElementById('bolum-listesi');
    // Örnek olarak 1'den 100'e kadar bölümleri kontrol et
    for(let b=1; b<=100; b++) {
        try {
            const chRes = await fetch(`veriler/${slug}/bolum-${b}.json`);
            if(!chRes.ok) break;
            liste.innerHTML += `<a href="okuyucu.html?slug=${slug}&bolum=${b}" class="bolum-item">Bölüm ${b}</a>`;
        } catch(e) { break; }
    }
}
detayYukle();
