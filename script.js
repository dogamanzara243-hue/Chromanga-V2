// script.js - ZIP Destekli V22
async function bolumAc(zipUrl) {
    const reader = document.getElementById('manga-reader');
    reader.innerHTML = "<div class='loading'>📦 Bölüm Hazırlanıyor...</div>";

    try {
        // 1. ZIP dosyasını Discord'dan çek
        const response = await fetch(zipUrl);
        if (!response.ok) throw new Error("Dosya alınamadı.");
        const data = await response.arrayBuffer();

        // 2. JSZip ile bellekte aç
        const zip = await JSZip.loadAsync(data);
        const images = [];

        // 3. İçindeki resimleri bul ve listele
        zip.forEach((path, file) => {
            if (!file.dir && path.match(/\.(webp|jpg|jpeg|png)$/i)) {
                images.push(file);
            }
        });

        // Sayfa isimlerine göre (001, 002...) sırala
        images.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));

        reader.innerHTML = ""; // Yükleniyor yazısını sil

        // 4. Resimleri ekrana bas
        for (let file of images) {
            const blob = await file.async("blob");
            const url = URL.createObjectURL(blob);
            
            const img = document.createElement('img');
            img.src = url;
            img.className = "manga-page";
            img.loading = "lazy"; // Performans için
            reader.appendChild(img);
        }
    } catch (err) {
        console.error(err);
        reader.innerHTML = "<div class='error'>❌ Hata: Bölüm yüklenemedi.</div>";
    }
}
