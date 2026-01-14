# e'eora - Luxury Minimalist Fragrance Website

A refined, luxury e-commerce website for e'eora fragrances, built with Next.js 14, TypeScript, and Tailwind CSS. The design embodies quiet luxury inspired by Chanel and Dior, featuring a pure white aesthetic, elegant typography, and subtle interactions.

## ✨ Design Philosophy

- **Quiet Luxury**: Minimalist design that speaks through elegance, not noise
- **Pure White Background**: Clean, breathing space
- **Refined Typography**: Serif fonts for headings (Playfair Display), sans-serif for body
- **Subtle Interactions**: Smooth transitions and micro-animations
- **Responsive Design**: Desktop-first, mobile-optimized
- **Accessibility**: Proper semantic HTML and ARIA labels

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with navigation & footer
│   ├── globals.css          # Global styles with Tailwind
│   ├── page.tsx             # Homepage with hero & featured collection
│   ├── fragrances/          # Fragrances listing page
│   ├── product/[id]/        # Dynamic product detail pages
│   ├── about/               # Brand story & values
│   ├── journal/             # Blog/editorial section
│   ├── contact/             # Contact form & info
│   └── checkout/            # Checkout flow (demo mode)
├── components/              # Reusable React components
│   ├── Navigation.tsx       # Fixed navbar with scroll detection
│   ├── Footer.tsx           # Minimal footer with links
│   ├── FragranceCard.tsx    # Reusable product card
│   └── Button.tsx           # Customizable button component
└── data/                    # Static data
    └── fragrances.ts        # Fragrance catalog with details

```

## 🎨 Key Components

### Navigation Bar
- Fixed positioning with scroll detection
- Transparent on hero section, solid white on scroll
- Minimal hover animations (underline effect)
- Cart icon linking to checkout

### Hero Section
- Full-viewport height background image
- Centered luxury tagline: "An essence beyond presence"
- Two CTA buttons (Explore / Buy Now)

### Product Cards
- 4-column responsive grid
- Hover effects: slight scale, soft shadow
- Product image, name, tagline, price
- "EXPLORE" button appears on hover

### Product Detail Page
- Large product image
- Detailed description and fragrance notes (top, heart, base)
- Quantity selector with +/- buttons
- "Add to Cart" and "Buy Now" buttons
- Related products section

### Checkout Page
- Multi-step form (Customer Info → Shipping → Payment)
- Demo payment mode disclaimer
- Order summary sidebar
- Trust badges (SSL, money-back guarantee, free shipping)

### About Page
- Editorial layout with large typography
- Three pillar sections: Craftsmanship, Ingredients, Philosophy
- Value propositions with images

### Journal Section
- Featured article highlight
- Grid of blog cards
- Minimal layout with images, titles, and excerpts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## 🎯 Design System

### Color Palette
- **Black**: `#000000` - Primary text and elements
- **White**: `#ffffff` - Background
- **Grays**: `#f5f5f5` to `#404040` - Subtle variations
- **Gold**: `#d4af37` - Accent (for future use)

### Typography
- **Headings**: Playfair Display (serif) - Light weight, wide tracking
- **Body**: System fonts (sans-serif) - Clean, readable
- **Font Weights**: Light (300) and normal (400) for minimalism
- **Letter Spacing**: Wide tracking (0.05em-0.1em) for luxury feel

### Spacing & Sizing
- Large white space between sections
- Generous padding/margins
- Thin dividers (`h-px` border)
- Aspect ratios: 3/4 for product images, 16/9 for blog

### Interactive Elements
- Smooth transitions (0.3s cubic-bezier)
- Hover states: slight color change or scale
- Button animations: border focus, background transitions
- Scroll detection for nav transparency effect

## 🔄 Page Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero & featured collection |
| `/fragrances` | All fragrances catalog |
| `/product/[id]` | Individual product detail page |
| `/about` | Brand story & values |
| `/journal` | Blog/editorial section |
| `/contact` | Contact form & company info |
| `/checkout` | Checkout flow (demo mode) |

## 📊 Data Structure

Fragrances stored in `src/data/fragrances.ts`:

```typescript
interface Fragrance {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  fullDescription: string;
}
```

## 🔧 Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display (Google Fonts)
- **Dev Tools**: ESLint, TypeScript

## 💳 Payment Integration (Future)

The checkout page is currently in **demo mode**. To integrate real payments:

1. Install Stripe: `npm install @stripe/react-js @stripe/js`
2. Add Stripe API keys to environment variables
3. Replace demo payment form with Stripe Elements
4. Implement backend payment processing

## 📱 Responsive Design

- **Mobile**: Single column, optimized touch targets
- **Tablet**: 2-column grids
- **Desktop**: 4-column grids, full spacing
- **Large Screens**: Max-width constraint (7xl) for readability

## ♿ Accessibility

- Semantic HTML (`<nav>`, `<footer>`, `<article>`)
- Proper heading hierarchy
- ARIA labels on interactive elements
- Color contrast ratios meet WCAG standards
- Keyboard navigation support

## 📈 Performance Optimizations

- Static site generation where possible
- Image optimization placeholders
- CSS minification via Tailwind
- ESLint code quality checks
- No unnecessary JavaScript libraries

## 🎨 Customization Guide

### Update Brand Colors
Edit `tailwind.config.ts` `colors` object

### Change Fonts
Update Google Fonts import in `layout.tsx` and `tailwind.config.ts`

### Modify Fragrances
Update `src/data/fragrances.ts` with new products

### Add Blog Posts
Add articles to `src/data/journal.ts` (create if needed)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

## 📄 License

© e'eora. All rights reserved.

---

**Built with ❤️ for luxury fragrance enthusiasts.**
