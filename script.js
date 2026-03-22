const JSON_URL = "manga-listesi.json";

// 1. Mangaları Yükle ve Kartları Oluştur
async function mangalariBaslat() {
    const grid = document.getElementById('manga-grid');
    grid.innerHTML = "<p>📡 Veriler yükleniyor...</p>";

    try {
        const response = await fetch(JSON_URL + "?v=" + Date.now());
        const veriler = await response.json();

        grid.innerHTML = ""; // Yükleniyor yazısını temizle

        veriler.forEach(manga => {
            const card = document.createElement('div');
            card.className = "manga-card";
            card.innerHTML = `
                <img src="${manga.cover}" alt="${manga.title}">
                <h3>${manga.title}</h3>
            `;
            card.onclick = () => bolumSec(manga);
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = `<p style="color:red">🚨 Hata: Veri çekilemedi. (${err.message})</p>`;
    }
}

// 2. Bölüm Seçme (Şimdilik Basit Prompt)
function bolumSec(manga) {
    const bolumNo = prompt(`${manga.title}\nOkumak istediğiniz bölümü yazın (Örn: 1)`);
    const anahtar = `bolum-${bolumNo}`;

    if (manga.bolumler && manga.bolumler[anahtar]) {
        zipOkuyucuBaslat(manga.bolumler[anahtar]);
    } else {
        alert("Üzgünüz, bu bölüm henüz eklenmemiş!");
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
