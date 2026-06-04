# SineQ APK İndirme Sitesi - Vercel Blob Sürümü

Bu sürüm Vercel için düzenlendi ve önceki 500 hatasına sebep olabilecek session/store yapısı kaldırıldı.
Admin oturumu Mongo session yerine güvenli imzalı cookie ile çalışır.

## Vercel Environment Variables

Vercel > Settings > Environment Variables bölümünde şunlar olmalı:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/sineq_apk_store
SESSION_SECRET=uzun_cok_guclu_bir_secret_yaz
BLOB_READ_WRITE_TOKEN=Vercel Blob bağlantısından otomatik gelir
UPLOAD_MAX_APK_MB=250
UPLOAD_MAX_LOGO_MB=8
```

Environment Variable ekledikten sonra mutlaka:

```txt
Deployments > son deployment > üç nokta > Redeploy
```

yapın.

## Hızlı kontrol

Yayına aldıktan sonra şu adresi açın:

```txt
https://site-adresiniz.vercel.app/health
```

Burada `MONGODB_URI`, `SESSION_SECRET` ve `BLOB_READ_WRITE_TOKEN` true görünmeli.

## Admin hesabı oluşturma

Aynı MongoDB bağlantısıyla kendi bilgisayarınızda:

```bash
npm install
copy .env.example .env
npm run create-admin
```

Oluşturulan admin MongoDB'ye kaydedilir. Vercel sitesi aynı MongoDB'ye bağlıysa giriş yapılır.

## Admin panel

```txt
/admin
```

## Düzeltilenler

- Vercel üzerinde 500 hatasına sebep olabilecek `connect-mongo` session store kaldırıldı.
- Admin giriş sistemi imzalı cookie ile serverless uyumlu hale getirildi.
- Blob upload kontrolündeki hata düzeltildi: upload artık giriş yapan admini doğru tanır.
- `/health` kontrol adresi eklendi.
- MongoDB bağlantı hatalarında yeniden deneme yapılacak şekilde düzenlendi.
