# 🧠 Canlı Quiz Platformu (Kahoot Klonu)

Bu proje, öğrencilerin canlı sınavlara katılabildiği, öğretmenlerin ise quiz oluşturup yönetebildiği socket tabanlı bir platformdur.

🟢 Uygulama canlıda: [https://kahoot-production.up.railway.app](https://kahoot-production.up.railway.app)

---

## 🎯 Projenin Amacı

- Öğrenciler sadece **isim** ve **oda kodu** ile sınavlara katılabilir
- Öğretmenler giriş yaparak quiz oluşturabilir, yönetebilir
- OpenAI API sayesinde konu girilerek **otomatik quiz oluşturulabilir**
- Tüm sistem **gerçek zamanlı** çalışır

---

## 🛠️ Kullanılan Teknolojiler

### Backend
- Node.js, Express
- Socket.io – gerçek zamanlı iletişim
- PostgreSQL + Sequelize – veritabanı
- JWT – kimlik doğrulama
- OpenAI API – otomatik soru üretimi

### Frontend
- HTML, CSS, JavaScript
- Responsive (mobil + masaüstü uyumlu)
- Basit, sade ve anlaşılır kullanıcı deneyimi

---

## 🧩 Özellikler

- [x] Öğrenciler: sadece isim ve kodla giriş
- [x] Öğretmenler: kayıt/giriş + quiz yönetimi
- [x] Canlı soru yayını ve cevaplama
- [x] Otomatik skor hesabı ve sıralama
- [x] OpenAI API ile quiz oluştur
- [x] Rastgele oda kodu üretme

---

## 🚀 Uygulama Ekranları

| Rol | Ekran |
|-----|-------|
| Öğrenci | Anasayfada isim + oda kodu ile sınava katılır |
| Öğretmen | Giriş yaptıktan sonra quiz oluşturabilir |
| Yönetim | Quiz başlatılır → sistem kod üretir → öğrenci katılır |

---

## 🌐 Canlı Demo

📍 [https://kahoot-production.up.railway.app](https://kahoot-production.up.railway.app)

---

## 🙏 Teşekkür

Projeyi bir üniversite dersi kapsamında geliştirdik. Bize bu fırsatı sunan hocam **İzzet Fatih Şentürk**’e ve araştırma görevlisi hocam **Yusuf Kayıpmaz**'a teşekkür ederim.
Projeye yeni özellikler eklemeye ve iyileştirmeye devam edeceğim.

---

## 📄 Lisans

MIT License
