# e'eora Development Guidelines

## Code Structure & Best Practices

### 1. Component Organization

All React components go in `src/components/`:

```
src/components/
├── Navigation.tsx       # Main navigation
├── Footer.tsx          # Footer
├── Button.tsx          # Reusable button
├── FragranceCard.tsx   # Product card
└── [Component].tsx     # Other components
```

**Component Template:**

```typescript
import React from 'react';

interface Props {
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function ComponentName({
  title,
  description,
  onClick,
}: Props) {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
}
```

### 2. Page Organization

Pages go in `src/app/` following Next.js App Router convention:

```
src/app/
├── page.tsx           # Homepage
├── layout.tsx         # Root layout
├── globals.css        # Global styles
├── fragrances/
│   └── page.tsx       # /fragrances route
├── product/
│   └── [id]/page.tsx  # /product/:id route
└── [other-pages]/
    └── page.tsx
```

### 3. Data Management

Static data lives in `src/data/`:

```typescript
// src/data/fragrances.ts
export interface Fragrance {
  id: string;
  name: string;
  // ... other fields
}

export const fragrances: Fragrance[] = [
  // Data
];
```

To use data in components:

```typescript
import { fragrances } from '@/src/data/fragrances';

export default function Page() {
  return (
    <div>
      {fragrances.map(fragrance => (
        <div key={fragrance.id}>{fragrance.name}</div>
      ))}
    </div>
  );
}
```

---

## Styling Guidelines

### 1. Tailwind CSS Only

We use Tailwind CSS for all styling. No inline styles or CSS modules unless necessary.

**Good:**
```jsx
<div className="max-w-7xl mx-auto px-6 py-24 bg-white">
  <h1 className="text-5xl font-light tracking-wider">Title</h1>
</div>
```

**Avoid:**
```jsx
<div style={{ maxWidth: '1280px', padding: '24px' }}>
  <h1 style={{ fontSize: '48px' }}>Title</h1>
</div>
```

### 2. Responsive Design Classes

Always use mobile-first approach with Tailwind breakpoints:

```jsx
// Default = mobile, md: = tablet (768px+), lg: = desktop (1024px+)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Grid items */}
</div>
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 3. Color Usage

Use semantic color names from Tailwind:

```jsx
// Good
<div className="bg-white text-black border border-gray-200">
  <p className="text-gray-600">Secondary text</p>
</div>

// Avoid arbitrary colors
<div className="bg-[#fff] text-[#000]">
```

### 4. Typography Classes

Standard typography patterns:

```jsx
// Page headings
<h1 className="text-5xl md:text-6xl font-light tracking-wider">
  Main Title
</h1>

// Section headings
<h2 className="text-3xl md:text-4xl font-light tracking-wider">
  Section Title
</h2>

// Subsection headings
<h3 className="text-xl md:text-2xl font-light tracking-wider">
  Subsection
</h3>

// Body text
<p className="text-base font-light leading-relaxed">
  Body paragraph text goes here
</p>

// Small text / captions
<p className="text-sm font-light text-gray-600">
  Secondary information
</p>

// Tiny labels (uppercase)
<p className="text-xs font-light tracking-widest uppercase">
  LABEL
</p>
```

### 5. Spacing Patterns

Consistent spacing using Tailwind scale:

```jsx
// Section padding (96px top/bottom)
<section className="py-24">

// Medium section (64px)
<section className="py-16">

// Small section (48px)
<section className="py-12">

// Container padding (24px left/right)
<div className="px-6">

// Gap between items (32px)
<div className="grid gap-8">

// Margin between elements (48px)
<div className="mb-12">

// Tight spacing (16px)
<div className="gap-4 mb-4">
```

---

## Component Patterns

### 1. Button Component

Usage:

```jsx
import Button from '@/src/components/Button';

<Button variant="primary">ACTION</Button>
<Button variant="secondary">ACTION</Button>
```

Properties:
- `variant`: 'primary' (black) or 'secondary' (white border)
- `className`: Additional Tailwind classes
- `onClick`: Click handler
- `disabled`: Boolean

### 2. Fragrance Card Component

Usage:

```jsx
import FragranceCard from '@/src/components/FragranceCard';

<FragranceCard
  id="product-id"
  name="Product Name"
  tagline="Poetic description"
  price={185}
  image="https://..."
/>
```

Wraps in Link to product detail page automatically.

### 3. Navigation Component

Auto-includes in root layout. Handles scroll detection for transparency effect.

Features:
- Fixed positioning
- Scroll detection
- Link hover animations
- Cart icon

### 4. Footer Component

Auto-includes in root layout.

Elements:
- Logo
- Tagline
- Divider
- Links (Privacy, Terms, Instagram)
- Copyright

---

## State Management

For simple state, use React hooks:

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function Component() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return <div>{isScrolled ? 'Scrolled' : 'Top'}</div>;
}
```

For complex state across pages, consider:
- Context API for shared state
- Zustand for lightweight state management
- Server Components for data fetching

---

## Performance Optimization

### 1. Use Next.js Image Component

```jsx
// Avoid
<img src="image.jpg" alt="Description" />

// Prefer (when needed)
import Image from 'next/image';

<Image
  src="image.jpg"
  alt="Description"
  width={500}
  height={600}
/>
```

Currently using placeholder images from Unsplash. Replace with optimized local images in production.

### 2. Code Splitting

Next.js automatically code-splits pages. No additional setup needed.

### 3. Server vs Client Components

```typescript
// Server Component (default)
export default function Page() {
  // Can access database, private keys, etc.
  return <div>...</div>;
}

// Client Component
'use client';

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(null);
  return <div>...</div>;
}
```

---

## TypeScript Best Practices

### 1. Type Component Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', ...props }: ButtonProps) {
  // Component
}
```

### 2. Type Data

```typescript
export interface Fragrance {
  id: string;
  name: string;
  price: number;
  // All fields with types
}

export const fragrances: Fragrance[] = [];
```

### 3. Avoid `any`

Use proper types instead of `any`:

```typescript
// Good
interface Props {
  onClick: (id: string) => void;
}

// Avoid
interface Props {
  onClick: any;
}
```

---

## Naming Conventions

### Files & Folders

```
// Components: PascalCase
src/components/Navigation.tsx
src/components/FragranceCard.tsx

// Pages: lowercase
src/app/about/page.tsx
src/app/product/[id]/page.tsx

// Data: camelCase
src/data/fragrances.ts

// Utilities: camelCase
src/utils/formatPrice.ts
```

### Variables & Functions

```typescript
// camelCase for variables
const productTitle = 'Essence Noir';

// camelCase for functions
const calculatePrice = () => {};

// UPPERCASE for constants
const MAX_PRICE = 500;

// PascalCase for components
const ProductCard = () => {};
```

### CSS Classes

```jsx
// Semantic names
className="mt-4 mb-8 px-6 py-3 bg-white text-black border border-gray-200"

// Component-specific (BEM style if needed)
className="product-card__image product-card__image--hover"
```

---

## Testing

### Run ESLint

```bash
npm run lint
npm run lint:fix
```

### Type Checking

TypeScript is configured with strict mode. Check for errors:

```bash
npx tsc --noEmit
```

---

## Git Workflow

### Commit Messages

Follow conventional commits:

```
feat: Add new fragrance to catalog
fix: Fix navigation scroll detection
docs: Update README
style: Format code with Prettier
chore: Update dependencies
```

### Branch Naming

```
feature/fragrance-carousel
fix/navigation-scroll
docs/readme-update
```

---

## Environment Variables

Create `.env.local`:

```env
# Add as needed
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Note:** `NEXT_PUBLIC_` prefix makes variables accessible in browser.

---

## Deployment Checklist

Before deploying:

- [ ] No console errors/warnings
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] All links work
- [ ] Responsive on mobile/tablet/desktop
- [ ] Forms submit (demo or real)
- [ ] Images load
- [ ] No hardcoded localhost URLs

---

## Future Enhancements

### Phase 2
- [ ] Cart functionality with Context/Zustand
- [ ] Product search and filtering
- [ ] User accounts and authentication
- [ ] Email subscriptions
- [ ] Analytics tracking

### Phase 3
- [ ] Stripe payment integration
- [ ] Order management
- [ ] Admin dashboard
- [ ] CMS integration
- [ ] Multi-language support

### Phase 4
- [ ] AI fragrance recommendations
- [ ] User reviews and ratings
- [ ] Social sharing features
- [ ] Mobile app version

---

## Troubleshooting

### Port Already in Use

The dev server defaults to port 3000. If in use, it tries 3001:

```bash
npm run dev
# Server runs on http://localhost:3001
```

To specify a port:

```bash
npm run dev -- -p 3002
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### TypeScript Errors

Ensure all types are proper:

```bash
npx tsc --noEmit
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react/hooks)

---

**Last Updated:** January 14, 2024  
**Version:** 1.0.0
