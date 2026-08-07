Buatkan component **Docs-like Editor** menggunakan **TipTap + ProseMirror + Yjs**. Tujuannya bukan meniru tampilan 100%, tetapi menyediakan arsitektur dan semua kelompok toolbar utama yang setara dengan Google Docs sehingga mudah dikembangkan.

![Image](https://images.openai.com/static-rsc-4/GiEUGTuzmKaQwWX0mPTDt_Zgg2X_fC0AEjahR-OWPZZlG5B1LKCnQjNxlSASSfrsTsrVwcNrSVEmi25KikY3howh2MDO2v4-9VNg5Y5qzDMwLQOyKZVvJLgvxkhVEGyiqJGqAYmxKuByKUzFAGyvJORyW8UGDA9qCX2oaf6YsbMI09CKVVFSHSzrcp9d9g_g?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/o0h7UvMpmdOUyBsbvfc1ATaeJxetQkNJJR7TtBH52UppUGfXTmK_X0xtL7f4YkOVOvTkPM3Ew7bFA91yBAi-3DUT9uWXK8YtbAx3g20ut0yoyqqX7jXoe-m4AR_jCXNOj31fqYMpDDy5w3oME3I6gmY3jS70yx03P0bzeWSIq3HY8Tm35ApNi6i1IKOiKCBi?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/1gwElTsOZ4TaG-HeYoWLG126bCXbF9qxp5grIEU0iFWJGLykp-J7D6-EHgW_b6qrVFvK02t-Gg2thX3PgePY8Z00ZyIUFkQQOOao_V3IZbO7IKyhe85k1Lxkx6OzOYcZ20BFP6lqbslKKgp-AEoCveJ8fq-k-KgGrvmdKNzcRJYVOR80gizTC_OniLBzpiOQ?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Zv5WZFpZkjNwKA3xpT9Dj38xuVp2CympuwB8iOuCZWd_oH1MpHANPAFPZMxSjSjc0PCo4OrCsEAvjVWxy5AH3q-JdKQmU71vpEtbXTJA0dGjLynZ_JS7cq6LXPdSzuuCebIb3F3zGc9vhsMNtCdbBM5OJN-Syp_qORdDQd_jPHlvTB977Q2o2Hg1tx661s4U?purpose=fullsize)

# Arsitektur

```text
┌───────────────────────────────────────────────────────────┐
│                    Vue / React App                        │
├───────────────────────────────────────────────────────────┤
│ Menu Bar                                                  │
│ Toolbar                                                   │
│ Ruler                                                     │
│ Document Area                                             │
│ Status Bar                                                │
└───────────────────────────────────────────────────────────┘
             │
             ▼
         TipTap Editor
             │
      ProseMirror State
             │
      Extensions (100+)
             │
        Yjs Collaboration
             │
       WebSocket Provider
             │
        Node.js Backend
```

---

# Layout

```text
+--------------------------------------------------------------+
| Menu Bar                                                     |
+--------------------------------------------------------------+
| Toolbar Row 1                                                 |
+--------------------------------------------------------------+
| Toolbar Row 2                                                 |
+--------------------------------------------------------------+
| Horizontal Ruler                                              |
+--------------------------------------------------------------+
|                                                              |
|                       Document                               |
|                                                              |
+--------------------------------------------------------------+
| Status Bar                                                   |
+--------------------------------------------------------------+
```

---

# Menu Bar

```text
File
Edit
View
Insert
Format
Tools
Extensions
Help
```

---

# Toolbar Row 1

```text
Undo
Redo
Print
Spell Check
Paint Format
Zoom

Styles

Font Family

Font Size

Decrease Font

Increase Font
```

---

# Toolbar Row 2

```text
Bold

Italic

Underline

Strike

Text Color

Highlight

Insert Link

Comment

Insert Image

Alignment

Line Spacing

Checklist

Bulleted List

Numbered List

Decrease Indent

Increase Indent

Clear Formatting
```

---

# Toolbar Row 3 (Opsional)

```text
Table

Drawing

Emoji

Horizontal Line

Page Break

Columns

Header

Footer

Footnote

Equation

Special Character

Code Block
```

---

# Toolbar Row 4 (Kolaborasi)

```text
Version History

Share

Presence

Track Changes

Suggestion Mode

Accept

Reject
```

---

# Sidebar

```text
Outline

Comments

Document Info

Templates

Bookmarks

AI Assistant
```

---

# Status Bar

```text
Word Count

Language

Cursor Position

Zoom

Page

Online Status

Collaboration Status
```

---

# TipTap Extensions

## Starter

```text
Document

Paragraph

Text

History

Dropcursor

Gapcursor

HardBreak
```

## Typography

```text
Bold

Italic

Underline

Strike

Subscript

Superscript

Code

CodeBlock

Highlight

Color

TextStyle

FontFamily

FontSize
```

## Heading

```text
Heading

Paragraph

Blockquote
```

## Lists

```text
BulletList

OrderedList

TaskList

TaskItem
```

## Table

```text
Table

TableRow

TableCell

TableHeader
```

## Alignment

```text
TextAlign
```

## Links

```text
Link
```

## Images

```text
Image

ImageResize

ImageCaption
```

## Media

```text
Video

Iframe
```

## Layout

```text
HorizontalRule

PageBreak

Columns
```

## Collaboration

```text
Collaboration (Yjs)

CollaborationCursor

Comments

Presence

Awareness
```

## History

```text
Undo

Redo

VersionHistory
```

## Utilities

```text
Placeholder

CharacterCount

SearchReplace

Markdown

ImportDocx

ExportDocx

ExportPdf
```

---

# Floating Toolbar

Saat memilih teks:

```text
Bold

Italic

Underline

Color

Highlight

Link

Comment
```

---

# Bubble Menu

```text
Copy

Cut

Paste

AI Rewrite

Translate

Summarize
```

---

# Slash Command

Ketik `/`

```text
/Heading 1

/Heading 2

/Table

/Image

/Quote

/Checklist

/Code

/Callout

/Divider

/Columns

/Equation
```

---

# Ruler

```text
Left Margin

Right Margin

Tab Stop

First Line Indent

Hanging Indent
```

---

# Keyboard Shortcuts

```text
Ctrl+B

Ctrl+I

Ctrl+U

Ctrl+Shift+7

Ctrl+Shift+8

Ctrl+K

Ctrl+Z

Ctrl+Shift+Z

Ctrl+/

Ctrl+Alt+1

Ctrl+Alt+2
```

---

# Ringkasan Peran

| Komponen        | Fungsi Utama         | Contoh Tanggung Jawab                                                                                                                               |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ProseMirror** | Mesin editor         | Cursor, selection, schema, transaction, history, plugin, keyboard, clipboard, document model.                                                       |
| **TipTap**      | API dan UI editor    | Toolbar, commands, extensions, Bubble Menu, Floating Menu, integrasi Vue/React, NodeView, import/export HTML & Markdown.                            |
| **Yjs**         | Kolaborasi real-time | Sinkronisasi perubahan, multi-cursor, presence, offline editing, merge conflict (CRDT), snapshot/versioning, sinkronisasi melalui WebSocket/WebRTC. |

Dengan pembagian seperti ini, setiap lapisan memiliki satu tanggung jawab yang jelas: **ProseMirror mengelola logika editor**, **TipTap menyajikan API dan antarmuka yang nyaman untuk membangun fitur editor**, dan **Yjs memastikan semua pengguna melihat dokumen yang sama secara real-time tanpa konflik**. Ini adalah pola arsitektur yang juga digunakan oleh banyak editor kolaboratif modern.


# Folder Structure

```text
/kiui/src/components/DocLikeEditor
├── index.ts
├── DocLikeEditor.vue
├── DocLikeEditor.stories.ts
├── DocLikeEditor.test.ts
├── Editor/
│   ├── MenuBar.vue
│   ├── Toolbar/
│   │   ├── HistoryToolbar.vue
│   │   ├── FontToolbar.vue
│   │   ├── ParagraphToolbar.vue
│   │   ├── InsertToolbar.vue
│   │   ├── TableToolbar.vue
│   │   ├── LayoutToolbar.vue
│   │   ├── CollaborationToolbar.vue
│   │   └── ViewToolbar.vue
│   ├── BubbleMenu.vue
│   ├── FloatingMenu.vue
│   ├── Ruler.vue
│   ├── Sidebar.vue
│   ├── StatusBar.vue
│   ├── SlashCommand.vue
│   ├── extensions/
│   ├── commands/
│   ├── plugins/
│   └── collaboration/
├── collaboration/
│   ├── yjs.ts                  # Membuat Y.Doc
│   ├── provider.ts             # WebSocket/WebRTC Provider
│   ├── awareness.ts            # Presence & cursor pengguna
│   ├── cursor.ts               # Konfigurasi cursor kolaborasi
│   └── snapshot.ts             # Versioning / snapshot
├── services/
│   ├── document.ts             # API simpan & buka dokumen
│   ├── upload.ts               # Upload gambar/file
│   └── export.ts               # Export PDF/DOCX
```

## Prioritas Implementasi

Agar proyek tetap terkelola, implementasikan dalam beberapa fase:

1. **MVP**: editor, toolbar dasar (bold, italic, heading, list, link, undo/redo), autosave.
2. **Dokumen**: tabel, gambar, warna teks, highlight, pencarian, ekspor PDF/DOCX.
3. **Layout**: ruler, page break, margin, header/footer, pagination.
4. **Kolaborasi**: Yjs, cursor pengguna lain, komentar, share, version history.
5. **Lanjutan**: suggestion mode, AI assistant, voice typing, template, import DOCX.

Dengan pendekatan ini, Anda mendapatkan editor yang secara fungsi dan struktur sangat mendekati Google Docs, namun tetap modular sehingga setiap toolbar merupakan komponen terpisah yang mudah diuji dan dikembangkan.

# Instruksi
buatkan rancangan implementasi untuk membuat component stories pada /kiui/src/components/DocLikeEditor

untuk kebutuhan server websoket/webrtc dapat membuatnya di folder server yang telah menggunakan framerwork nestjs

jangan koding dulu 
buat implementasi pada folder implementations/imp-doc-like-editor-component.md