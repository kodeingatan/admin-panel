update ./docs/architecture.md
update ./docs/PRD.md
update ./docs/design-system.md

## Server
buatkan middleware server untuk validasi users, guards, roles, permissions
1. cek role users
2. cek guard users :
    - batasi akses sesuai dengan column allows urls untuk apa saja yang dibolehkan untuk di akses 
    - batasi akses sesuai dengan column deny urls untuk apa saja yang tidak boleh di akses
3. cek permission users :
    - batasi akses sesuai dengan column methods untuk method apa saja yang boleh digunakan pada url pada column urls
    - batasi akses sesuai dengan column urls untuk mengizinkan method dan url apa saja yang dapat di aksesk

urls yang dimaksut merupkan keseluruhan urls dari server dan client yang harus dapat dibuatkan validasi middleware aksesnya 

## Client
buatkan alart atau redirect page di sisi client
1. cek role user
2. jika tidak memliki akses terhadap guard atau perrmission jangan tampilkan konten yang memanggil api atau aksi yang mengarah ke url tersebut
3. jika memaksa aksess tetapi tervalidasi terhadap guard oleh server makan akan muncul alert untuk memeberikan pesan tidak diberikan izin guard tidak valid...dsb. ...
4. jika memaksa aksess tetapi tervalidasi terhadap permission oleh server makan akan muncul alert untuk memeberikan pesan tidak diberikan izin, permission tidak valid...dsb. ...

## Seeders
buatkan lebih banyak guard seeders
buatkan lebih banyak permission seeders
buatkan lebih banyak role seeders
buatkan lebih banyak user seeders

# Instruction
update AGENTS.md

jangan koding dulu, 
buatkan implementasi middleware validasi guard, permission, role, user pada file taks/09-user-role-permission-guard-middleware.md
 


