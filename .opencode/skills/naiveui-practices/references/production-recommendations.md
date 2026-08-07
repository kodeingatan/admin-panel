# Production Recommendations Naive UI

## Build Configuration

### Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  optimizeDeps: {
    include: ['naive-ui', 'vue', 'vue-router']
  }
})
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "types": ["naive-ui/volar"]
  }
}
```

## Bundle Optimization

### Tree Shaking
- Gunakan direct import untuk setiap komponen
- Jangan gunakan global install (`app.use(naive)`)
- Hindari wildcard import (`import * from 'naive-ui'`)

### Code Splitting
Naive UI mendukung code splitting secara otomatis:
- Komponen di-load sesuai kebutuhan
- Lazy loading bisa dikombinasikan dengan `defineAsyncComponent`

## SSR Configuration

```vue
<template>
  <n-config-provider
    :inline-theme-disabled="true"
    style-mount-target="head"
  >
    <app />
  </n-config-provider>
</template>
```

## Error Handling

### Global Error Handler

```ts
// main.ts
import { createApp } from 'vue'
import { createDiscreteApi } from 'naive-ui'

const { message, dialog, notification } = createDiscreteApi(
  ['message', 'dialog', 'notification'],
  { providerProps: {} }
)

// Global error handler
app.config.errorHandler = (err) => {
  message.error('Terjadi kesalahan')
  console.error(err)
}
```

## Accessibility

### ARIA Attributes
Naive UI menyediakan ARIA attributes built-in. Pastikan:
- Gunakan label yang deskriptif
- Hindari color sebagai satu-satunya indikator
- Test dengan screen reader

### Keyboard Navigation
- Menu, Tabs, dan Dropdown mendukung keyboard navigation
- Gunakan `tabindex` yang sesuai
- Pastikan semua interactive elements bisa diakses

## Security

### XSS Prevention
- Naive UI melakukan sanitization pada content
- Gunakan `v-html` dengan hati-hati
- Validasi input dari user

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; style-src 'self' 'unsafe-inline'">
```

## Testing

### Unit Testing
```ts
import { mount } from '@vue/test-utils'
import { NButton } from 'naive-ui'

describe('NButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(NButton, {
      props: { type: 'primary' }
    })
    expect(wrapper.classes()).toContain('n-button--primary-type')
  })
})
```

### E2E Testing
```ts
// Cypress
describe('Form Submission', () => {
  it('submits form successfully', () => {
    cy.visit('/form')
    cy.get('.n-input input').type('John')
    cy.get('.n-button').click()
    cy.get('.n-message').should('contain', 'Success')
  })
})
```

## Monitoring

### Performance Monitoring
- Monitor bundle size secara berkala
- Gunakan Lighthouse untuk audit
- Pantau Core Web Vitals

### Error Tracking
- Integrasikan dengan Sentry atau error tracking service
- Log errors dari Naive UI components
- Monitor warning di development mode
