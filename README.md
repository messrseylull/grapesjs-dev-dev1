# Web Tabanlı Office Uygulaması

Bu proje, GrapesJS tabanlı bir ofis uygulamasının Docker üzerinde çalışacak şekilde Node.js (Express) ve MySQL ile entegre edilmiş halidir.

## Proje Bağlantıları
* **Docker Container Uygulama Linki:** [http://localhost:3000](http://localhost:3000)
* **Github Repo Adresi: https://github.com/messrseylull/grapesjs-dev-dev1

## Örnek Kullanıcı Tanımlamaları
Uygulama arayüzüne (index.html) güvenlik ve test amacıyla bir giriş ekranı eklenmiştir. Giriş yapmak için aşağıdaki örnek kullanıcı bilgilerini kullanabilirsiniz:

* **Kullanıcı Adı:** `admin`
* **Şifre:** `1234`

## Veritabanı Bilgileri (MySQL)
Docker image'ında örnek veritabanı otomatik olarak oluşturulmaktadır. 

* **Veritabanı Adı:** `office_db`
* **Kullanıcı Adı:** `root`
* **Şifre:** `root`
* **Tablo:** `kayitlar` (id, datetime, data alanlarını içerir)

## Çalıştırma Talimatları (Docker)
Bu proje bütünüyle `docker-compose` üzerinde çalışmaya uygundur. Çalıştırmak için proje dizininde terminali açıp aşağıdaki komutu girmeniz yeterlidir:

```bash
docker-compose up --build
```

Komut çalıştıktan sonra uygulama `localhost:3000` portunda yayına girecektir. Veritabanı bağlantısı arka planda otomatik kurulur ve gerekli tablo oluşturulur.
