### Perbaikan :
- menu item hasil generate sc modules ketika di klik tidak menampilkan apapun hanya tampilan putih, perbaiki agar menampilkan tabel browse pada awal
- hasil generate sc modules tidak dapat tampil untuk melakukan CRUD, tampilkan hasil generate sc modules agar dapat dilakukan CRUD !
- siderbar "Admin" > "System Creators" tidak memiliki icon, perbaiki agar memiliki icon

### Pembaruan : 
- sc modules tidak perlu disimpan dalam database
- tampilkan item menu hasil system creators tidak berada di dalam grop "Generated Modules" tetapi di luar setara dengan menu item Dashboard
- jika ingin memakukan kedalam suatu group silahkan cek dalam pengimputan menu label pada create new module, 
    jika menu label : {nama label} maka tempatkan menu item tidak dalam group
    jika menu label : {nama grop}_{nama label} maka tempatkan menu sesuai nama group dan tambahkan menu item dalam group tersebut dengan nama nama group
- ubah nama `server/src/modules/generated` menjadi `server/src/modules/managements`
- perbarui pembuatan system creators pada bagian pengisian fields :
    - saat ini tidak ada pengisian fieds untuk type select with relations dan multiple select with relations, tambahkan type baru 
        - select with relation : memilih berdasarkann relasi table (pilih salah satu)
        - multiple select with relation : memilih berdasarkann relasi table (pilih lebih dari satu)
- tambahkan step baru pada pembuatan system creators,  setelah step fieds tambahkan step layout :
    - disini dapat mengatur tata layout browse (tabel) bentuknya mau seperti apa serta tambahkan yang relevan lainya
    - disini dapat mengatur tata layout create (input form) atur tata letak inputan, panjang inputan, serta tambahkan yang relevan lainya
    - disini dapat mengatur tata layout update (input form)  atur tata letak inputan, panjang inputan, serta tambahkan yang relevan lainya

# Sebelum membuat rencana impelementasi
- pahami semua permintaan di atas, untuk menyelaraskan pemikiran berikan beberapa pertanyaan kepada saya
- buatkan docs khusus untuk fitur system creators 
- update docs/architecture.md dan pecah yang berkaitan dengan system creators pada file docs/system-creators/architecture.md
- update docs/PRD.md dan pecah yang berkaitan dengan system creators pada file docs/system-creators/PRD.md
- update docs/database.md dan pecah yang berkaitan dengan system creators pada file docs/system-creators/database.md
- update AGENTS.md

jangan koding dulu, 
buatkan rencana implementasi pada file tasks/features/system-creators/10-{sesuaikan nama}.md,
buatkan rencana testing pada file tasks/features/system-creators/10-{sesuaikan nama}-testing.md



