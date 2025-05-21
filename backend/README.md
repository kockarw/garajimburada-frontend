# GarajımBurada API

Bu depo, GarajımBurada uygulamasının backend API'sini içermektedir. Bu API, garaj listelerinin yönetilmesi, kullanıcı kimlik doğrulaması ve değerlendirme işlemleri için hizmet sunmaktadır.

## Teknolojiler

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Kimlik Doğrulama
- Multer (Dosya Yükleme)

## Kurulum

1. Gerekli paketleri yükleyin:
   ```
   npm install
   ```

2. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri yapılandırın:
   ```
   cp .env.example .env
   ```

3. PostgreSQL veritabanı oluşturun:
   ```
   createdb garajim_db
   ```

4. Uygulamayı geliştirme modunda çalıştırın:
   ```
   npm run dev
   ```

## API Dokümantasyonu

### Kimlik Doğrulama Endpointleri

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgilerini getir

### Kullanıcı Endpointleri

- `GET /api/users` - Tüm kullanıcıları getir (admin)
- `GET /api/users/:id` - ID'ye göre kullanıcı getir
- `PUT /api/users/:id` - Kullanıcı bilgilerini güncelle
- `DELETE /api/users/:id` - Kullanıcı sil
- `GET /api/users/:id/garages` - Kullanıcının garajlarını getir
- `GET /api/users/:id/reviews` - Kullanıcının değerlendirmelerini getir

### Garaj Endpointleri

- `GET /api/garages` - Tüm garajları getir (filtreleme destekli)
- `GET /api/garages/:id` - ID'ye göre garaj detaylarını getir
- `POST /api/garages` - Yeni garaj oluştur (kimlik doğrulama gerekli)
- `PUT /api/garages/:id` - Garaj bilgilerini güncelle (sahiplik doğrulama gerekli)
- `DELETE /api/garages/:id` - Garaj sil (sahiplik doğrulama gerekli)
- `PATCH /api/garages/:id/toggle-active` - Garajın aktif durumunu değiştir (admin)
- `PATCH /api/garages/:id/toggle-verified` - Garajın doğrulanma durumunu değiştir (admin)

### Değerlendirme Endpointleri

- `GET /api/reviews/garage/:garageId` - Garajın değerlendirmelerini getir
- `POST /api/reviews/garage/:garageId` - Garaja yeni değerlendirme ekle (kimlik doğrulama gerekli)
- `PUT /api/reviews/:id` - Değerlendirmeyi güncelle (sahiplik doğrulama gerekli)
- `DELETE /api/reviews/:id` - Değerlendirmeyi sil (sahiplik doğrulama gerekli)
- `PATCH /api/reviews/:id/toggle-verified` - Değerlendirmenin doğrulanma durumunu değiştir (admin)

### Dosya Yükleme Endpointleri

- `POST /api/upload/image` - Tek resim yükle (kimlik doğrulama gerekli)
- `POST /api/upload/images` - Birden fazla resim yükle, maksimum 5 (kimlik doğrulama gerekli)

## Veritabanı Şeması

API, aşağıdaki ana tabloları içeren bir veritabanı şeması kullanmaktadır:

- **users** - Kullanıcı hesapları
- **garages** - Garaj listeleri
- **working_hours** - Garajların çalışma saatleri
- **gallery_images** - Garaj galeri resimleri
- **reviews** - Garaj değerlendirmeleri

## Lisans

Bu proje özel kullanım içindir. 