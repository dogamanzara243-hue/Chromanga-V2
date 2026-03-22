// script.js - V31 Kesin Çözüm
const JSON_URL = "manga-listesi.json";

async function siteyiYukle() {
    const grid = document.getElementById('manga-grid');
    grid.innerHTML = "📡 Veriler senkronize ediliyor...";

    try {
        // Önbelleği (cache) kırmak için v= ekliyoruz
        const res = await fetch(JSON_URL + "?v=" + Date.now());
        const veriler = await res.json();

        if (veriler.length === 0) {
            grid.innerHTML = "📭 Liste şu an boş. Discord'dan veri bekleniyor...";
            return;
        }

        grid.innerHTML = ""; // Temizle
        veriler.forEach(manga => {
            const card = document.createElement('div');
            card.className = "manga-card";
            card.innerHTML = `
                <img src="${manga.cover}" onerror="this.src='https://via.placeholder.com/200x300?text=Kapak+Yok'">
                <h3>${manga.title}</h3>
                <p style="font-size:12px; color:gray; text-align:center;">${manga.updated}</p>
            `;
            card.onclick = () => bolumSec(manga);
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = "❌ Hata: Veri dosyası okunamadı. JSON formatını kontrol et!";
        console.error(err);
    }
}

// Bölüm seçme ve ZIP okuyucuya gönderme
function bolumSec(manga) {
    const b = prompt(`${manga.title}\nBölüm numarasını yazın (Örn: 1):`);
    const key = "bolum-" + b;
    if(manga.bolumler && manga.bolumler[key]) {
        // ZIP okuyucu fonksiyonunu burada çağır (önceki verdiğim kodlardaki gibi)
        zipOkuyucuBaslat(manga.bolumler[key]);
    } else {
        alert("Bu bölüm henüz eklenmemiş!");
    }
}

window.onload = siteyiYukle;        alert("Üzgünüz, bu bölüm henüz eklenmemiş!");
    }
}

// 3. ZIP Dosyasını Aç ve Resimleri Diz
async function zipOkuyucuBaslat(zipUrl) {
    if(zipUrl === "TEST_LINKI") {
        alert("Bu bir test bölümüdür. Lütfen Colab ile oluşturduğunuz gerçek bir Discord ZIP linkini ekleyin!");
        return;
    }

    const modal = document.getElementById('reader-modal');
    const pages = document.getElementById('manga-pages');
    
    modal.style.display = "block";
    pages.innerHTML = "<p style='text-align:center; padding:50px;'>📦 Bölüm paketi açılıyor, lütfen bekleyin...</p>";

    try {
        const res = await fetch(zipUrl);
        const arrayBuffer = await res.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        const resimDosyalari = [];
        zip.forEach((path, file) => {
            if (!file.dir && path.match(/\.(webp|jpg|jpeg|png)$/i)) {
                resimDosyalari.push(file);
            }
        });

        // Sayfa numarasına göre sırala
        resimDosyalari.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));

        pages.innerHTML = ""; // Temizle
        for (let file of resimDosyalari) {
            const blob = await file.async("blob");
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            pages.appendChild(img);
        }
    } catch (err) {
        alert("Hata: ZIP dosyası açılamadı! Link bozuk olabilir.");
        kapat();
    }
}

function kapat() {
    document.getElementById('reader-modal').style.display = "none";
    document.getElementById('manga-pages').innerHTML = "";
}

window.onload = mangalariBaslat;    imgs.sort((a,b) => a.name.localeCompare(b.name, undefined, {numeric:true}));
    
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
