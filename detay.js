
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

async function detayVerileriniGetir() {
    // 1. Manga Bilgilerini Doldur
    const res = await fetch('manga-listesi.json');
    const mangalar = await res.json();
    const manga = mangalar.find(m => m.slug === slug);

    if(manga) {
        document.getElementById('manga-baslik').innerText = manga.title;
        document.getElementById('manga-ozet').innerText = manga.description;
        document.getElementById('manga-kapak').src = manga.cover;
        if(document.getElementById('blur-bg')) {
            document.getElementById('blur-bg').style.backgroundImage = `url(${manga.cover})`;
        }
    }

    // 2. Bölümleri Listele (Otomatik Tarama)
    const liste = document.getElementById('bolum-listesi');
    liste.innerHTML = ""; // Temizle
    
    for(let b=1; b<=150; b++) {
        try {
            const check = await fetch(`veriler/${slug}/bolum-${b}.json`);
            if(check.ok) {
                liste.innerHTML += `<a href="okuyucu.html?slug=${slug}&bolum=${b}" class="bolum-item">Bölüm ${b}</a>`;
            } else if (b > 5) break; // Eğer ilk 5'ten sonra yoksa dur
        } catch(e) { break; }
    }
}
document.addEventListener('DOMContentLoaded', detayVerileriniGetir);
