# e'eora Design System & Style Guide

A comprehensive guide to the e'eora design language, component library, and usage patterns.

## 🎨 Design Principles

### 1. Quiet Luxury
- Restraint over excess
- Intention over decoration
- Whisper over shout

### 2. Minimalism
- Generous whitespace
- Thin dividers and accents
- Light typography weights

### 3. Timelessness
- No trendy patterns
- Elegant, classic layouts
- Sustainable design practices

### 4. Accessibility
- WCAG AA compliant
- Readable font sizes
- High contrast ratios

## 📐 Visual Language

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Primary text, elements |
| White | #ffffff | Background |
| Gray 50 | #fafafa | Subtle backgrounds |
| Gray 100 | #f5f5f5 | Section backgrounds |
| Gray 200 | #e5e5e5 | Dividers, borders |
| Gray 300 | #d4d4d4 | Subtle accents |
| Gray 500 | #737373 | Secondary text |
| Gray 600 | #525252 | Tertiary text |
| Gray 700 | #404040 | Disabled state |
| Gold | #d4af37 | Accent (reserved) |

### Typography

#### Heading Font: Playfair Display

```
- Weights: 400 (Light), 700 (Bold)
- Letter-spacing: 0.05em - 0.1em
- Usage: All h1, h2, h3, h4 elements
- Sizes:
  - h1: 48px (mobile) → 112px (desktop)
  - h2: 32px (mobile) → 80px (desktop)
  - h3: 24px (mobile) → 48px (desktop)
  - h4: 20px → 32px
```

#### Body Font: System Sans-Serif

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue"

- Weights: 300 (Light), 400 (Regular), 500 (Medium)
- Letter-spacing: Normal (0) to 0.05em
- Line-height: 1.6 for body, 1.2 for headings
- Sizes:
  - Body: 16px base
  - Small: 14px
  - Tiny: 12px
```

### Spacing System

```
Tailwind spacing (4px base):
- 4px (0.25rem) = 1
- 8px (0.5rem) = 2
- 12px (0.75rem) = 3
- 16px (1rem) = 4
- 24px (1.5rem) = 6
- 32px (2rem) = 8
- 48px (3rem) = 12
- 64px (4rem) = 16
- 96px (6rem) = 24
```

**Usage:**
- Section padding: `py-24` (96px top/bottom)
- Card padding: `p-6` to `p-8` (24px-32px)
- Component gaps: `gap-6` to `gap-12` (24px-48px)
- Margins between elements: `mb-4` to `mb-8`

### Shadow System

```
Minimal shadows for luxury feel:
- No heavy drop shadows
- Hover state: `shadow-lg` (subtle lift)
- Max shadow: `shadow-xl` (very subtle)
- Prefer thin borders and spacing over shadows
```

## 🧩 Component Library

### Button

**Primary Button** (Black)
```jsx
<Button variant="primary">
  CALL TO ACTION
</Button>
```

**Secondary Button** (White with border)
```jsx
<Button variant="secondary">
  SECONDARY ACTION
</Button>
```

**Properties:**
- Font: Light (300)
- Tracking: `tracking-widest` (0.1em)
- Padding: `px-8 py-3`
- Border: 1px solid
- Hover: Background transition
- Active: `scale-95` animation

### Fragrance Card

```jsx
<FragranceCard
  id="product-id"
  name="Product Name"
  tagline="Poetic description"
  price={185}
  image="url-to-image"
/>
```

**Features:**
- 3/4 aspect ratio image
- Hover: Scale 105%, shadow increase
- "EXPLORE" button appears on hover
- Minimal info: Name, tagline, price

### Navigation Bar

**States:**
1. **Transparent** (on hero): No background
2. **Solid** (on scroll): White background + subtle shadow
3. **Hover Links**: Underline animation from left to right

**Elements:**
- Logo: e'eora (light, no shadow)
- Links: Home, Fragrances, About, Journal, Contact
- Cart icon: SVG, clickable

### Input Fields

```jsx
<input
  type="text"
  placeholder="Placeholder text"
  className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
/>
```

**States:**
- Default: `border-gray-300`
- Focus: `border-black` (no outline)
- Disabled: `opacity-50`

### Dividers

**Thin horizontal divider:**
```jsx
<div className="h-px bg-gray-200" />
```

**Purpose:** Subtle separation between sections

---

## 📐 Layout Patterns

### Hero Section
```
- Full viewport height
- Centered content
- Background image with overlay
- Typography centered
- CTAs in row layout (stack on mobile)
```

### Featured Collection
```
- Max-width container (7xl)
- Section header centered
- 4-column grid (desktop)
- 2-column grid (tablet)
- 1-column grid (mobile)
- Cards with consistent spacing
```

### Product Detail
```
- 2-column layout (desktop)
- Image left, details right
- Sticky info panel on scroll (desktop)
- Stacked layout (mobile)
- Notes in 3-column sub-grid
```

### Editorial/Blog
```
- Large hero image
- Feature article centered
- 3-column grid for cards
- Image aspect: 16/9
- Text overlay or below image
```

---

## 🎭 Interaction Patterns

### Micro-interactions

**Hover Effects:**
- Links: Underline animation (0.3s)
- Buttons: Background/border transition
- Cards: Lift + shadow (transform + shadow)
- Images: Subtle scale (1.05x on hover)

**Transitions:**
```css
transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

**Animations:**
- Page fade-in: (CSS, no JavaScript)
- Scroll detection: Navigation bar transparency
- Button press: `active:scale-95`

### States

**Link States:**
- Default: Color black, underline width 0
- Hover: Underline grows
- Active: Underline full width
- Visited: No change

**Button States:**
- Default: Full opacity
- Hover: Slight color shift
- Active: Scale down slightly
- Disabled: Opacity 50%

**Input States:**
- Default: Gray border
- Focus: Black border
- Filled: Color intact
- Error: Red border (future)

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Cols | Usage |
|------------|-------|------|-------|
| Mobile | < 640px | 1 | Small phones |
| SM | 640px | 1-2 | Larger phones |
| MD | 768px | 2 | Tablets |
| LG | 1024px | 3-4 | Large tablets |
| XL | 1280px | 4 | Desktops |
| 2XL | 1536px | 4 | Large monitors |

**Container:**
- Max-width: `7xl` (80rem / 1280px)
- Padding: `px-6` (24px left/right)
- Auto margin: `mx-auto`

---

## 🎯 Typography Hierarchy

```
h1: 48px (mobile) → 112px (desktop) | Playfair Light | 0.1em tracking
h2: 32px (mobile) → 80px (desktop) | Playfair Light | 0.1em tracking
h3: 24px (mobile) → 48px (desktop) | Playfair Light | 0.05em tracking
h4: 20px → 32px | Playfair Regular | 0.05em tracking

Body: 16px | System Sans | 0 tracking | font-light
Secondary: 14px | System Sans | 0 tracking | font-light
Label: 12px | System Sans | 0.05em tracking | UPPERCASE
```

---

## 🔧 CSS Class Patterns

### Typography
```jsx
// Headings
<h1 className="text-5xl md:text-6xl font-light tracking-wider">...</h1>
<h2 className="text-3xl md:text-4xl font-light tracking-wider">...</h2>
<h3 className="text-xl md:text-2xl font-light tracking-wider">...</h3>

// Body
<p className="text-base font-light leading-relaxed">...</p>
<p className="text-sm font-light">...</p>
<p className="text-xs font-light tracking-widest uppercase">...</p>
```

### Containers
```jsx
<div className="max-w-7xl mx-auto px-6 py-24">
  {/* Content */}
</div>
```

### Grids
```jsx
// 4-column on desktop, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Items */}
</div>
```

### Dividers
```jsx
<div className="h-px bg-gray-200" />  {/* Horizontal */}
<div className="w-px bg-gray-200 h-full" />  {/* Vertical */}
```

### Spacing
```jsx
// Sections
<section className="py-24">...</section>

// Cards
<div className="p-6 md:p-8">...</div>

// Gaps between items
<div className="grid gap-8">...</div>

// Margins
<div className="mb-12">...</div>
```

---

## 🚀 Component Creation Checklist

When creating new components:

- [ ] Uses `font-light` for elegance
- [ ] Includes proper `tracking-*` for luxury feel
- [ ] Has smooth `transition-*` for interactions
- [ ] Supports mobile/tablet/desktop layouts
- [ ] Minimal use of colors (black/white/gray)
- [ ] Generous whitespace and padding
- [ ] No shadows or subtle shadows only
- [ ] Proper semantic HTML
- [ ] Accessible (contrast, sizes, labels)
- [ ] TypeScript typed props
- [ ] No unused dependencies

---

## 📚 Resources

- [Tailwind CSS Classes](https://tailwindcss.com/docs)
- [Playfair Display Font](https://fonts.google.com/specimen/Playfair+Display)
- [WCAG Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Last Updated:** January 14, 2024  
**Version:** 1.0.0  
**Maintained by:** e'eora Design Team
