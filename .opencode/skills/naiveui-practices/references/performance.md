# Performa Naive UI

## Tree Shaking

Naive UI mendukung tree shaking penuh. Gunakan direct import untuk mengoptimalkan bundle size:

```vue
<!-- ✅ Optimized — hanya NButton yang di-load -->
<script setup>
import { NButton } from 'naive-ui'
</script>

<!-- ❌ Tidak optimal — semua komponen di-load -->
<script setup>
import naive from 'naive-ui'
app.use(naive)
</script>
```

## Virtual Scrolling

Untuk dataset besar (>1000 rows), gunakan virtual scrolling:

```vue
<!-- ✅ Virtual scrolling -->
<n-data-table
  :data="largeDataset"
  virtual-scroll
  :max-height="400"
/>

<!-- ❌ Tidak menggunakan virtual scrolling -->
<n-data-table :data="largeDataset" />
```

## Inline Theme Disabled

Untuk SSR atau devtools yang lebih bersih:

```vue
<n-config-provider :inline-theme-disabled="true">
  <app />
</n-config-provider>
```

## Lazy Tab Loading

```vue
<!-- ✅ Lazy loading — content hanya load saat tab aktif pertama kali -->
<n-tabs display-directive="show:lazy">
  <n-tab-pane name="tab1" tab="Tab 1">
    <heavy-component />
  </n-tab-pane>
</n-tabs>

<!-- ❌ Content di-mount meskipun tab tidak aktif -->
<n-tabs>
  <n-tab-pane name="tab1">
    <heavy-component />
  </n-tab-pane>
</n-tabs>
```

## Component-Level Import

```ts
// ✅ Import hanya yang dibutuhkan
import { NButton, NInput, NForm, NFormItem } from 'naive-ui'

// ❌ Import semua
import * as naive from 'naive-ui'
```

## CSS Variable Caching

Naive UI menggunakan theme hashing untuk caching:
- `mergedThemeHashRef` — cache key untuk theme computations
- Theme tidak di-compute ulang jika tidak berubah

## Style Mount Target

```vue
<!-- Mount styles ke head alih-alih body -->
<n-config-provider style-mount-target="head">
  <app />
</n-config-provider>
```

## Performance Tips

1. **Gunakan `row-key` di DataTable** — Mempercepat re-render
2. **Batasi `pageSize`** — Jangan render terlalu banyak row sekaligus
3. **Gunakan `virtual-scroll` untuk data >1000 rows**
4. **Hindari nested NConfigProvider berlebihan** — Meningkatkan overhead
5. **Gunakan `display-directive="if"` untuk tabs yang jarang digunakan**
6. **Lazy load komponen berat** — Gunakan `defineAsyncComponent`
7. **Hindari inline functions di template** — Gunakan computed atau methods
8. **Gunakan ` shallowRef` untuk data besar** — Menghindari deep reactivity
