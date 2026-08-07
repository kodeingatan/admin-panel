# Konsep Inti Naive UI

## Arsitektur Komponen

### Provider Pattern

Naive UI menggunakan provider-injection pattern untuk konfigurasi global:

```
NConfigProvider
├── NMessageProvider (untuk pesan programatik)
├── NDialogProvider (untuk dialog programatik)
├── NNotificationProvider (untuk notifikasi programatik)
├── NModalProvider (untuk modal programatik)
└── NLoadingBarProvider (untuk loading bar)
```

### Controlled vs Uncontrolled

Mode | Deskripsi
-----|----------
Controlled | State dikelola parent melalui props dan events
Uncontrolled | Komponen mengelola state internal sendiri

Contoh Controlled:
```vue
<n-input v-model:value="text" />
```

Contoh Uncontrolled:
```vue
<n-input default-value="initial text" />
```

## Data Flow

Semua komponen mengikuti pola data flow konsisten:

1. **Props** → Data masuk dari parent
2. **Events** → Notifikasi ke parent (on-update:*)
3. **Slots** → Customisasi konten
4. **Expose** → Method yang bisa dipanggil parent via template ref

## Composable Pattern

Komponen Naive UI menggunakan composable hooks:

| Hook | Fungsi |
|------|--------|
| `useTheme` | Akses tema dan style variables |
| `useConfig` | Akses konfigurasi global |
| `useFormItem` | Integrasi dengan form validation |
| `useLocale` | Akses terjemahan lokal |
| `useRtl` | Dukungan RTL layout |
| `useStyle` | Mount style ke DOM |

## CSS-in-JS Architecture

Naive UI menggunakan `css-render` untuk CSS-in-JS:

- Style didefinisikan sebagai fungsi yang menerima theme variables
- Style di-mount sebagai CSS variables di DOM
- Mendukung server-side rendering
- Mendukung dark/light theme switching

## Virtual Scrolling

Untuk dataset besar, komponen mendukung virtual scrolling:

- DataTable: vertical dan horizontal virtual scrolling
- Tree: virtual scrolling untuk hierarchical data
- Select/Cascader: virtual scrolling untuk opsi banyak
- AutoComplete: virtual scrolling untuk saran

## TreeMate Integration

Library `treemate` menyediakan struktur data tree yang digunakan oleh:
- Tree
- TreeSelect
- Cascader
- Menu
- Dropdown

Fitur TreeMate:
- Traversal tree
- Pencarian node
- Manajemen checkbox strategy
- Lazy loading
