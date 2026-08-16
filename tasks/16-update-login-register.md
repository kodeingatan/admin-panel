# Task 16: Update Login & Register Pages

## Goal
Redesign login dan register pages dengan layout split-screen (image + form), animasi transisi yang cantik, dan UX yang lebih baik.

## Current State
- `LoginPage.vue` (84 baris): Form sederhana di dalam `AuthForm` wrapper (centered card)
- `RegisterPage.vue` (139 baris): Form register di dalam `AuthForm` wrapper
- `AuthForm.vue` (21 baris): Centered layout dengan gradient background
- Transisi yang tersedia: `fade`, `slide-up`, `slide-left`, `scale` di `animations.css`

## Target State

### Layout Split-Screen
```
Login:                          Register:
┌─────────────┬──────────┐     ┌──────────┬─────────────┐
│             │          │     │          │             │
│   GAMBAR    │  FORM    │     │  FORM    │   GAMBAR    │
│   (kiri)    │ (kanan)  │     │ (kiri)   │   (kanan)   │
│             │          │     │          │             │
└─────────────┴──────────┘     └──────────┴─────────────┘
```

### Animasi Transisi
- Login ↔ Register: Slide horizontal (kiri/kanan) berdasarkan arah navigasi
- Form fields: Staggered fade-in on mount
- Image panel: Subtle parallax atau fade effect
- Button: Scale + ripple effect

## Implementation Plan

### Phase 1: Buat AuthLayout Component
**File baru**: `client/src/components/common/AuthLayout/AuthLayout.vue`

Props:
- `title: string`
- `subtitle?: string`
- `imagePosition: 'left' | 'right'`
- `imageSrc?: string` (default placeholder)

Layout:
- Container flex full-height
- Image panel (50%): Gradient overlay + illustration/pattern
- Form panel (50%): Centered form card

### Phase 2: Update LoginPage.vue
- Ganti `AuthForm` → `AuthLayout`
- Image position: `right` (form kiri, gambar kanan... eh wait, prompt bilang Login: form kanan, gambar kiri)
- Tambah staggered animation untuk form fields
- Tambah link animasi ke register

### Phase 3: Update RegisterPage.vue
- Ganti `AuthForm` → `AuthLayout`
- Image position: `right` (form kiri, gambar kanan)
- Tambah staggered animation untuk form fields
- Tambah link animasi ke login

### Phase 4: Animasi Transisi Login ↔ Register
- Buat wrapper component `AuthTransition.vue` atau gunakan Vue `<Transition>`
- Animasi slide horizontal saat navigasi antara login ↔ register
- Direction-aware: dari login ke register slide ke kiri, sebaliknya ke kanan

### Phase 5: Enhance Visual Design
- Image panel: Gradient background + SVG pattern/illustration
- Form card: Subtle shadow + glass morphism effect
- Input fields: Focus animation (border color transition)
- Submit button: Loading state dengan spinner
- Responsive: Mobile layout stack vertical

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `client/src/components/common/AuthLayout/AuthLayout.vue` | CREATE | Layout split-screen component |
| `client/src/views/LoginPage.vue` | EDIT | Use AuthLayout, add animations |
| `client/src/views/RegisterPage.vue` | EDIT | Use AuthLayout, add animations |
| `client/src/assets/styles/animations.css` | EDIT | Tambah auth-specific animations |

## Animations Detail

### Form Field Stagger
```css
.auth-field-enter-active { transition: all 0.3s ease-out }
.auth-field-enter-from { opacity: 0; transform: translateY(10px) }
/* Delay: index * 50ms */
```

### Page Transition (Login ↔ Register)
```css
.auth-slide-left-enter-active,
.auth-slide-left-leave-active { transition: transform 0.3s ease }
.auth-slide-left-enter-from { transform: translateX(100%) }
.auth-slide-left-leave-to { transform: translateX(-100%) }

.auth-slide-right-enter-from { transform: translateX(-100%) }
.auth-slide-right-leave-to { transform: translateX(100%) }
```

### Image Panel
- Gradient: `from-blue-600 to-indigo-700`
- Pattern overlay: SVG dots/lines pattern
- Optional: Ilustrasi SVG (astronaut, robot, abstract shape)

## Responsive
- `< 768px`: Stack vertical (image top, form bottom)
- Image panel: `height: 200px` di mobile
- Form panel: Full width di mobile

## Dependencies
- Naive UI components sudah ada
- Animasi CSS sudah ada di `animations.css`
- Tidak perlu dependency baru

## Testing
1. Visual check di desktop (1920x1080)
2. Visual check di mobile (375x812)
3. Test navigasi login → register → login
4. Test form validation tetap berfungsi
5. Test responsive behavior
6. Test reduced-motion preference

## Estimated Effort
- AuthLayout: 100-150 baris
- LoginPage update: 30-50 baris
- RegisterPage update: 40-60 baris
- Animations: 30-40 baris
- Total: ~250-300 baris baru/ubah
