buatkan simple component editorjs dengan tollbar berikut : 
Icon	Nama Fitur	Editor.js
↶	Undo	editorjs-undo
↷	Redo	editorjs-undo
100%	Zoom	Custom UI (bukan fitur Editor.js)
+	Zoom In	Custom UI
H	Heading	@editorjs/header
• List	Bullet List	@editorjs/list
B	Bold	Inline Toolbar (built-in)
I	Italic	Inline Toolbar (built-in)
S	Strikethrough	Inline Toolbar (built-in)
U	Underline	editorjs-underline
🖍	Marker / Highlight	@editorjs/marker
Align Left	Text Align	editorjs-text-alignment-blocktune
Align Center	Text Align	editorjs-text-alignment-blocktune
Align Right	Text Align	editorjs-text-alignment-blocktune
Align Justify	Text Align	editorjs-text-alignment-blocktune
Table	Table	@editorjs/table
↕︎	Line Height / Spacing	Custom Plugin

jika bingung kamu bisa mempelajari docs/editorjs

buatkan pada folder kiui/src/components/EditorJS
yang berisikan file 
- EditorJS.vue
- EditorJS.stories.ts
- EditorJS.test.ts
- index.ts

pastikan setelah membuat component lakukan ujicoba dengan file .test.ts



