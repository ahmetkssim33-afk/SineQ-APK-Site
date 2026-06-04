# SineQ APK İndirme Sitesi - Vercel Blob Sürümü

Bu sürüm Vercel için hazırlandı.

## Özellikler

- Node.js + Express
- MongoDB Atlas
- Vercel Blob ile APK/logo yükleme
- Admin giriş sistemi
- Admin dashboard
- APK yayınlama/taslak yapma
- İndirme sayacı
- Ana sayfa, detay sayfası, indirme sayfası
- Gizlilik Politikası, Kullanım Şartları, İletişim, İçerik Kaldırma

## Yerel kurulum

```bash
npm install
copy .env.example .env
npm run create-admin
npm run dev
```

Admin panel:

```txt
http://localhost:3000/admin
```

## Vercel yayınlama

1. Projeyi GitHub'a yükle.
2. Vercel > Add New Project > GitHub reposunu seç.
3. Environment Variables kısmına şunları ekle:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/sineq_apk_store
SESSION_SECRET=uzun_cok_guclu_bir_secret_yaz
BLOB_READ_WRITE_TOKEN=Vercel_Blob_token
UPLOAD_MAX_APK_MB=250
UPLOAD_MAX_LOGO_MB=8
```

4. Vercel Storage bölümünden Blob store oluştur ve projeye bağla.
5. Deploy et.

## Admin hesabı

Admin hesabını en kolay kendi bilgisayarında oluştur:

```bash
copy .env.example .env
```

`.env` içine canlı MongoDB Atlas bağlantını yaz. Sonra:

```bash
npm install
npm run create-admin
```

Bu işlem admin kullanıcısını MongoDB Atlas içine yazar. Vercel'deki site aynı database'e bağlı olduğu için admin girişi çalışır.

## Önemli

- APK/logo dosyaları yerel diske değil Vercel Blob'a yüklenir.
- Kullanıcı indirme butonuna bastığında sayaç +1 artar ve Blob URL'ye yönlendirilir.
- Büyük APK dosyaları için client-side multipart Blob upload kullanılır.
