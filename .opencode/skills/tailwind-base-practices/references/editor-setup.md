# Editor Setup Tailwind CSS

## VS Code

### 1. Install Extensions

- **Tailwind CSS IntelliSense** — Auto-completion, linting, hover preview
  - Extension ID: `bradlc.vscode-tailwindcss`

### 2. VS Code Settings

```json
{
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.lint.unknownAtRules": "ignore"
}
```

### 3. Fitur

- **Auto-completion** — Ketik `bg-` untuk melihat semua warna
- **Linting** — Deteksi class yang tidak valid
- **Hover preview** — Lihat style saat hover
- **Color preview** — Lihat warna inline

## JetBrains (WebStorm, IntelliJ)

### 1. Install Plugin

- **Tailwind CSS** — Official plugin dari JetBrains

### 2. Konfigurasi

- Auto-detect `tailwind.config.js` atau CSS file dengan `@theme`
- Support untuk custom variants
- Color preview inline

## Neovim / Vim

### 1. Install LSP

```lua
-- Menggunakan nvim-lspconfig
require'lspconfig'.tailwindcss.setup{}
```

### 2. Plugins

- **tailwind-tools.nvim** — Tailwind-specific features
- **tw-values.nvim** — Preview Tailwind values

## Sublime Text

### 1. Install Package

- **Tailwind CSS IntelliSense** — Melalui Package Control

## Emacs

### 1. Install Package

- **lsp-mode** — Dengan tailwindcss LSP server

## Cara Kerja LSP

Tailwind CSS IntelliSense menggunakan LSP (Language Server Protocol) untuk:

1. **Scanning** — Scan project untuk class names
2. **Validation** — Validasi class names
3. **Completion** — Suggest class names
4. **Diagnostics** — Error/warning messages

## Troubleshooting

### 1. Tidak Ada Auto-completion

```json
// VS Code settings.json
{
  "tailwindCSS.emmetCompletions": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### 2. Linting Errors

```css
/* Tambahkan di CSS file */
/* stylelint-disable */
```

### 3. Performance Issues

```json
// VS Code settings.json
{
  "tailwindCSS.experimental.classRegex": [],
  "tailwindCSS.files.exclude": [
    "**/node_modules/**",
    "**/.git/**"
  ]
}
```

## Tips

1. **Gunakan Tailwind CSS IntelliSense** — Extension resmi dari Tailwind Labs
2. **Enable quickSuggestions** — Untuk auto-completion di strings
3. **Disable linting untuk custom classes** — Jika menggunakan custom utilities
4. **Gunakan Emmet** — Untuk shorthand syntax
5. **Restart LSP** — Jika auto-completion tidak berfungsi
