## Client 
telah login masuk ke dashboard, pada dashboard terdapat user management yang terdiri dari : 
- user
- guard
- role
- permissions

## Tambahan Feature
### User
- bisa lihat detail
- bisa delete
- dibuat oleh admin menginputkan :
    - first name
    - last name
    - email
    - username
    - password
    - role (multiple select)
    - permission (multiple select)
- table browser 
    - searching global
    - orders fields
    - pagination
    - jumlah data di tampilkan (10,25,50,100,all)
    - bisa memilih field yang boleh ditampilkan

### Guard
- bisa lihat detail
- bisa delete
- dibuat oleh admin menginputkan untuk create atau update :
    - guard name
    - allow urls ((multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) )
    - deny urls (multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) 
    - description
- table browser 
    - searching global
    - orders fields
    - pagination
    - jumlah data di tampilkan (10,25,50,100,all)
    - bisa memilih field yang boleh ditampilkan

### Role
- bisa lihat detail
- bisa delete
- dibuat oleh admin menginputkan untuk create atau update :
    - role name
    - guard (multiple select berdasarkan guard)
    - permission (multiple select berdasarkan permission)
    - description
- table browser 
    - searching global
    - orders fields
    - pagination
    - jumlah data di tampilkan (10,25,50,100,all)
    - bisa memilih field yang boleh ditampilkan

### Permission
- bisa lihat detail
- bisa delete
- dibuat oleh admin menginputkan untuk create atau update :
    - permission name
    - allow method (multiple select : GET, POST, PUT, DELETE, PATCH, OPTION, bisa menambahkan manual sesuai jika * mengizinkan semuanya )
    - allow urls ((multiple select search berdasarkan list route url server, serta bisa menambahkan manual seperti /example/* untuk sub path seterusnya pake bintang ) ) 
    - description
- table browser 
    - searching global
    - orders fields
    - pagination
    - jumlah data di tampilkan (10,25,50,100,all)
    - bisa memilih field yang boleh ditampilkan


# Instruction 
update docs/architecture.md
buatkan rencana implementasi untuk penambahan feature pada file taks/06-update-feature-user-management.md


