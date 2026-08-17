saat ini kita memiliki client dan server dan telah berhasil membuat base admin panel

bagaimana menurut kamu jika kita buat CRUD Generate dinamis seperti : https://github.com/thedevdojo/voyager namun base table, columns/fields tidak berada pada database tetapi berada pada file langsung pada sisi server

contoh seperti alur singkatnya :
### sisi client 
1. menyediakan menu item baru dengan nama sistem creators yang hanya dapat di akses oleh super admin
2. jika masuk ke sistem creators dan membuat/tambah makan diminta untuk  mendefenisikan nama column dan tipe columns dan lainya yang relevan base practice lebih baik menurut kamu
3. jika berhasil membuat maka server akan bekerja

### sisi server
4. jika server menerima request untuk membuat sistem creators maka server akan atomatis membuat src/modules/{nama sesuai permintaan client}, dengan nama file dan folder sebagai berikut yang memikuti base practice dari nestjs : 
- controlles (folder berisikan controllers)
  - {nama sesuai permintaan}.controller.ts
- dto (folder berisi DTO)
  - semua file yang berkaitan dengan dto ...
- entities (folder berisi entities)
  - {nama sesuai permintaan}.entity.ts
- service (folder berisikan services)
  - (nama sesuai permintaan).service.ts
- {nama sesuai permintaan}.module.ts

untuk menandatakan membuat mudule dengan sistem creator tandai folder dengan prefix sc_{nama module}, semua konfiguasi yang dibutuhkan client nantinya berada folder ini

### sisi client
5. setelah server berhasil membuat modul tersebut, maka : 
- pada menu sistem creators terdapat terdapat browser table yang mengidentifikasikan hasil pembuatan module tersebut, seperti nama, nama_module, dan lainya yang relevan dapat di tambahkan
6. akan mucul menu item baru pada sidebar yang berkaitan dengan modul yang telah berhasil di buat sistem creators tadi 
7. jika menu item tersebut di klik, maka akan menampilakan CRUD (CREATE, READ, UPDATE, DELETE) dan browse tabel dasar sesuai permintaan pada sistem creators tadi


bagaimana menurut mu, jika telah telah mengeti kamu boleh membuatnya, dan buat lebih baik lagi lebi dari permintaan saya diatas, 
untuk desain seperti biasa lebih bagus dan cantik, jika belum paham kamu boleh mengajukan pertanyaan pada saya

jangan koding dulu
