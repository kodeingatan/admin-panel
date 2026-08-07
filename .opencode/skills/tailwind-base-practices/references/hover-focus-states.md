# Hover, Focus & Other States Tailwind CSS

## Interactive Variants

| Variant | Fungsi | Contoh |
|---------|--------|--------|
| `hover:` | Saat mouse hover | `hover:bg-blue-700` |
| `focus:` | Saat element focus | `focus:ring-2` |
| `active:` | Saat element aktif/klik | `active:bg-blue-800` |
| `visited:` | Link yang sudah dikunjungi | `visited:text-purple-600` |
| `first:` | Anak pertama | `first:rounded-tl-lg` |
| `last:` | Anak terakhir | `last:rounded-br-lg` |
| `odd:` | Anak ganjil | `odd:bg-gray-100` |
| `even:` | Anak genap | `even:bg-gray-50` |
| `disabled:` | Saat disabled | `disabled:opacity-50` |
| `checked:` | Saat checkbox/radio checked | `checked:border-blue-500` |
| `required:` | Input required | `required:border-red-500` |
| `placeholder:` | Input placeholder | `placeholder:text-gray-400` |

## Group Variants

Styling parent berdasarkan state child:

```html
<div class="group">
  <img class="group-hover:scale-110 transition" />
  <button class="group-focus:ring-2">Save</button>
</div>
```

### Named Groups
```html
<div class="group/menu">
  <button class="group-hover/menu:block">Menu</button>
</div>
```

## Peer Variants

Styling sibling berdasarkan state lain:

```html
<div>
  <input class="peer" />
  <label class="peer-focus:text-blue-600 peer-checked:text-green-500">
    <!-- -->
  </label>
</div>
```

### Named Peers
```html
<div>
  <input id="email" class="peer/email" />
  <label for="email" class="peer-focus/email:text-blue-600">
    <!-- -->
  </label>
</div>
```

## Form Input States

### Required Input
```html
<input class="required:border-red-500 focus:required:ring-2" />
```

### Invalid Input (dengan validasi browser)
```html
<input class="invalid:border-red-500 focus:invalid:ring-2" />
```

## Any-Hover dan Any-Focus

Untuk mobile/touch devices:

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

```html
<div class="hover:bg-blue-500 any-hover:underline">
  <!-- hover hanya berlaku di touch devices -->
</div>
```

## Targeting Specific Elements

### Placeholder Text
```html
<input class="placeholder:text-gray-400 focus:placeholder:text-gray-300" />
```

### First Child
```html
<ul>
  <li class="first:font-bold">First item</li>
</ul>
```

### Last Child
```html
<ul>
  <li class="last:pb-0">Last item</li>
</ul>
```

### Odd/Even Children
```html
<table>
  <tr class="odd:bg-gray-50 even:bg-gray-100">
    <!-- -->
  </tr>
</table>
```

## Disabled State

```html
<button class="bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
  Submit
</button>
```

## Dark Mode + Hover

```html
<div class="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
  <!-- -->
</div>
```

## Responsive + Interactive

```html
<button class="md:hover:bg-blue-700 lg:focus:ring-4">
  <!-- -->
</button>
```

## Multiple Variants

```html
<div class="hover:bg-blue-500 focus:bg-blue-600 active:bg-blue-700">
  <!-- -->
</div>
```

## Best Practices

1. **Urutan konsisten**: `hover:` → `focus:` → `active:`
2. **Gunakan transitions** untuk smooth interactions:
   ```html
   <button class="bg-blue-500 hover:bg-blue-700 transition-colors duration-200">
   ```

3. **Perhatikan mobile** — hover tidak berfungsi di touchscreen
4. **Gunakan focus-visible** untuk keyboard navigation:
   ```css
   @custom-variant focus-visible {
     &:focus-visible {
       @slot;
     }
   }
   ```

5. **Tambahkan disabled state** untuk semua interactive elements
