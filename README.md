# Mandalorian Terminal

Selim Enes Çevik'in Mandalorian / spacecraft komut konsolu estetiğinden ilham alan, interaktif komut satırı portföyü. Saf HTML/CSS/JavaScript ile yazılmış, GitHub Pages üzerinde Jekyll `remote_theme` ile servis edilen tek sayfalık bir uygulamadır — build aracı, framework veya npm bağımlılığı gerektirmez.

🔗 **Canlı site:** https://enescedev.github.io/

## Tasarım yönü

Arayüz, klasik "yeşil hacker terminali" yerine endüstriyel / uzay gemisi komuta konsolu diline yaslanır: köşeli panel çerçeveleri, mat çelik gri tonları, kısık amber/mavi vurgular, ince ayraçlar ve "SYSTEM ONLINE" tarzı durum göstergeleri. Star Wars/Mandalorian etkisi renk paleti, geometri ve tipografi üzerinden hissettirilir; telif hakkıyla korunan görsel/logo kullanılmaz.

## Özellikler

- **Mandalorian komut konsolu arayüzü** — köşeli panel çerçeveleri, durum çubuğu (`SESSION`, `MODE`, `INPUT`), üst başlıkta çevrimiçi göstergesi.
- **Kısa açılış (boot) dizisi** — `INITIALIZING SYSTEM...` tarzı birkaç satırlık metin animasyonu (~1 sn), herhangi bir tuşa basarak veya tıklayarak atlanabilir; eski sürekli çalışan Matrix canvas animasyonunun yerini almıştır (performans için).
- **Komut satırı arayüzü** — komut geçmişi (↑/↓), `Tab` ile otomatik tamamlama, `Ctrl+L` ile ekranı temizleme, `Esc` ile girişi sıfırlama.
- **Mobil kısayol çubuğu** — dar ekranlarda `TAB`/`↑`/`↓`/`ESC`/`CTRL+L`/`ENTER` için 44px dokunma hedefli buton satırı.
- **Hash tabanlı derin bağlantılar** — `/#about` gibi bir URL açıldığında ilgili komut otomatik çalışır; tanımsız bir rota geldiğinde terminalde okunabilir bir hata gösterilir. `404.html` da bilinmeyen statik yolları aynı `#rota` mekanizmasına yönlendirir.
- **Açık/koyu tema** — `theme` komutuyla değiştirilir.
- **Veri odaklı içerik** — ad/unvan, hakkında, yetenekler, iş deneyimi, eğitim, bağlantılar ve iletişim bilgileri `data/profile.json` dosyasından okunur; sayfa koduna dokunmadan güncellenebilir.
- **Erişilebilirlik** — semantik yapı, görünür odak halkaları, `aria-live` terminal çıktısı, `prefers-reduced-motion` desteği (açılış animasyonu ve karakter-karakter yazma efekti devre dışı kalır, içerik anında görünür).
- **Güvenli render** — kullanıcının yazdığı komutlar ve harici veriler DOM'a `textContent`/HTML-escape ile yazılır; ham `innerHTML = kullanıcıGirdisi` kullanılmaz (XSS'e karşı).

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `help` | Kullanılabilir komutları listeler |
| `about` | Hakkında bilgisini gösterir |
| `skills` | Yetenek listesini gösterir |
| `experience` | İş deneyimlerini gösterir |
| `education` | Eğitim bilgisini gösterir |
| `links` | GitHub/LinkedIn/Medium bağlantılarını listeler |
| `contact` | E-posta, telefon ve LinkedIn bilgisini gösterir |
| `system` | Anlık sistem/oturum durumunu gösterir (yerel saat, oturum modu) |
| `clear` | Terminal ekranını temizler |
| `theme` | Açık/koyu tema arasında geçiş yapar |
| `motd` | Karşılama mesajını yeniden gösterir |
| `download-cv` | CV dosyasını yeni sekmede açar |
| `open <github\|linkedin\|medium\|proje-id>` | İlgili bağlantıyı veya `data/profile.json` içindeki `projects` alanında tanımlı projeyi yeni sekmede açar |
| `ascii` | Mandalorian ASCII sanatını yazdırır |

## Proje yapısı

```
.
├── index.html            # Tek sayfa uygulama iskeleti, terminal chrome + status bar
├── scripts/app.js        # Terminal mantığı, komutlar, boot dizisi, klavye/mobil kontrolleri
├── styles/main.css       # Mandalorian tasarım sistemi (renk tokenları, panel/durum çubuğu, responsive)
├── data/profile.json     # Ad/unvan/hakkında/yetenek/deneyim/eğitim/bağlantı/iletişim verisi
├── assets/cv/            # İndirilebilir CV dosyası
├── privacy.html          # Gizlilik politikası sayfası (tema ile uyumlu)
├── 404.html               # Bilinmeyen yolları hash'e yönlendiren sayfa (tema ile uyumlu)
└── _config.yml             # GitHub Pages / Jekyll remote_theme ayarı
```

## data/profile.json şeması

```jsonc
{
  "name": "...",           // MOTD başlığında gösterilir
  "role": "...",           // MOTD başlığında gösterilir
  "about": "...",
  "skills": ["...", ...],
  "experience": [
    { "company": "...", "role": "...", "years": "...", "details": ["...", ...] }
  ],
  "education": [
    { "institution": "...", "degree": "...", "years": "..." }
  ],
  "links": { "github": "...", "linkedin": "...", "medium": "..." },
  "contact": { "email": "...", "phone": "..." },
  "cv": "assets/cv/....pdf"
}
```

`open <anahtar>` komutu, `links` nesnesindeki her anahtarı ve (varsa) `projects` dizisindeki `id` alanlarını destekler.

## Yerel geliştirme

Statik bir site olduğundan herhangi bir HTTP sunucusuyla çalıştırılabilir, örneğin:

```bash
python3 -m http.server 8000
```

ardından `http://localhost:8000` adresini açın. `fetch('data/profile.json')` kullanıldığından `file://` ile doğrudan açmak yerine bir HTTP sunucusu üzerinden servis etmek gerekir.

## Dağıtım

Site, `main` dalına yapılan push'larla GitHub Pages üzerinden otomatik olarak yayınlanır. `_config.yml` içindeki `remote_theme: pages-themes/hacker@v0.2.0` ayarı, GitHub Pages'in Jekyll build sürecini etkinleştirir; görsel tasarımın tamamı `styles/main.css` içindeki özel Mandalorian tema tarafından belirlenir.

## Lisans

[MIT](LICENSE)
