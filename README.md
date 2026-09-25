# Terminal Portfolio

Selim Enes Çevik'in terminal temalı kişisel portföy sitesi. Saf HTML/CSS/JavaScript ile yazılmış, GitHub Pages üzerinde Jekyll `remote_theme` (hacker teması) ile servis edilen tek sayfalık bir uygulamadır — build aracı veya framework gerektirmez.

🔗 **Canlı site:** https://enescedev.github.io/

## Özellikler

- **Matrix giriş animasyonu** — sayfa açılışında canvas tabanlı "matrix rain" efekti, ardından MOTD (hoş geldin mesajı) gösterilir.
- **Komut satırı arayüzü** — komut geçmişi (↑/↓), `Tab` ile otomatik tamamlama, `Ctrl+L` ile ekranı temizleme.
- **Hash tabanlı derin bağlantılar** — `/#about` gibi bir URL açıldığında ilgili komut otomatik çalışır (`404.html` da bilinmeyen yolları `#yol` biçimine yönlendirip aynı mekanizmayı kullanır).
- **Açık/koyu tema** — `theme` komutuyla değiştirilir.
- **Veri odaklı içerik** — hakkında, yetenekler, iş deneyimi, eğitim, bağlantılar ve iletişim bilgileri `data/profile.json` dosyasından okunur; sayfa koduna dokunmadan güncellenebilir.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `help` | Kullanılabilir komutları listeler |
| `about` | Hakkında bilgisini gösterir |
| `skills` | Yetenek listesini gösterir |
| `experience` | İş deneyimlerini gösterir |
| `links` | GitHub/LinkedIn/Medium bağlantılarını listeler |
| `contact` | E-posta, telefon ve LinkedIn bilgisini gösterir |
| `clear` | Terminal ekranını temizler |
| `theme` | Açık/koyu tema arasında geçiş yapar |
| `motd` | Karşılama mesajını (Matrix ASCII + ipucu) yeniden gösterir |
| `download-cv` | CV dosyasını yeni sekmede açar |
| `open <github\|linkedin\|medium\|proje-id>` | İlgili bağlantıyı veya `data/profile.json` içindeki `projects` alanında tanımlı projeyi yeni sekmede açar |
| `ascii` | Mandalorian ASCII sanatını yazdırır |

## Proje yapısı

```
.
├── index.html            # Tek sayfa uygulama iskeleti
├── scripts/app.js        # Terminal mantığı, komutlar, animasyonlar
├── styles/main.css        # Görsel tasarım (terminal penceresi, temalar)
├── data/profile.json      # Hakkında/yetenek/deneyim/bağlantı/iletişim verisi
├── assets/cv/             # İndirilebilir CV dosyası
├── privacy.html           # Gizlilik politikası sayfası
├── 404.html                # Bilinmeyen yolları hash'e yönlendiren sayfa
└── _config.yml             # GitHub Pages / Jekyll remote_theme ayarı
```

## İçeriği güncelleme

Kişisel bilgileri kod değiştirmeden güncellemek için `data/profile.json` dosyasını düzenleyin:

- `about`, `skills`, `experience`, `education` — metin ve liste alanları
- `links` — `github`, `linkedin`, `medium` gibi anahtar/URL çiftleri (`open <anahtar>` komutuyla açılır)
- `contact` — `email`, `phone`
- `cv` — `download-cv` komutunun açacağı dosya yolu

## Yerel geliştirme

Statik bir site olduğundan herhangi bir HTTP sunucusuyla çalıştırılabilir, örneğin:

```bash
python3 -m http.server 8000
```

ardından `http://localhost:8000` adresini açın. `fetch('data/profile.json')` kullanıldığından `file://` ile doğrudan açmak yerine bir HTTP sunucusu üzerinden servis etmek gerekir.

## Dağıtım

Site, `main` dalına yapılan push'larla GitHub Pages üzerinden otomatik olarak yayınlanır. `_config.yml` içindeki `remote_theme: pages-themes/hacker@v0.2.0` ayarı, terminal görünümünün temel Jekyll temasını belirler.

## Lisans

[MIT](LICENSE)
