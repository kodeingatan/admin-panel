# Tujuan
membuat sumber kebenaran project
membuat struktur database


# MVP
## Tujuan Aplikasi
admin panel untuk user management system

## Dashboard
- tambahkan menu item baru pada sidebar
    - User Management
        - User
        - Guard
        - Role
        - Permissions
    buat menu item tersebut dan operasikan sesuai dengan feture

## Daftar Fitur
### Dashboard - User Management System - User
- dibuat oleh admin menginputkan :
    - first name
    - last name
    - email
    - username
    - password
    - role (multiple select)
    - permission (multiple select)
- default seeders : 
    - username : admin, email : admin@admin.com, password : P455w0rd!!!

### Dashboard - User Management System - Guard
-  dibuat oleh admin menginputkan :
    - guard name
    - allow urls ((multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) )
    - deny urls (multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) 
    - description
- default seeders : 
    - buatkan dan suaikan

### Dashboard - User Management System - Role 
- dibuat oleh admin menginputkan :
    - role name
    - guard (multiple select berdasarkan guard)
    - permission (multiple select berdasarkan permission)
    - description
- default seeders : 
    - buatkan dan sesuaikan

### Dashboard - User Management System - Permission
- dibuat oleh admin menginputkan :
    - permission name
    - allow method (multiple select : GET, POST, PUT, DELETE, PATCH, OPTION, bisa menambahkan manual sesuai jika * mengizinkan semuanya )
    - allow urls ((multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) ) 
    - description
- default seeders : 
    - buatkan dn sesuaikan


# Alur Authorization
```
Request
↓
Login
↓
JWT
↓
Ambil User
↓
Role
↓
Permission
↓
Guard
↓
Method cocok?
↓
URL cocok?
↓
Allow
↓
Response
```

# Instruction
buatkan docs/PRD.md
buatkan docs/database.md
update docs/docs/architecture.md
update AGENTS.md

jangan koding dulu hanya jalanakan instruction dan buat file impementasi tasks/04-update-dashboard-menu-item.md 
    - fokus pada ./client 
    - update menu dashboard 