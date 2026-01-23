export interface Fragrance {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;  // Now uses full path
  images?: string[]; // Multiple images support
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  fullDescription: string;
}

export const fragrances: Fragrance[] = [
  {
    id: "essence-noir",
    name: "Essence Noir",
    tagline: "Whispers of midnight elegance",
    price: 185,
    image: "/assets/bb.jpg",  // Full path - ensure file exists in public/assets/
    topNotes: ["Bergamot", "Black Currant"],
    heartNotes: ["Iris", "Rose", "Violet"],
    baseNotes: ["Vetiver", "Musk", "Sandalwood"],
    fullDescription: "A captivating fragrance that embodies quiet luxury.",
  },
  {
    id: "luminous-trace",
    name: "Luminous Trace",
    tagline: "Where light touches the soul",
    price: 175,
    image: "/assets/blueEthereal.jpg",
    topNotes: ["Lemon", "Grapefruit"],
    heartNotes: ["Gardenia", "Peony", "Freesia"],
    baseNotes: ["Amber", "Cashmere Wood", "Musk"],
    fullDescription: "An ethereal composition capturing the essence of dawn.",
  },
  {
    id: "velvet-sanctuary",
    name: "Velvet Sanctuary",
    tagline: "A refuge in refined fragrance",
    price: 195,
    image: "/assets/flawless.jpg",  // Updated to match your map
    topNotes: ["Pink Pepper", "Cardamom"],
    heartNotes: ["Tuberose", "Orange Blossom", "Jasmine"],
    baseNotes: ["Vanilla", "Oud", "Cedarwood"],
    fullDescription: "Luxuriously wrapped in warmth and sophistication.",
  },
  {
    id: "crystalline-veil",
    name: "Crystalline Veil",
    tagline: "Pure, transparent, timeless",
    price: 165,
    image: "/assets/seven.jpg",  // Updated to match your map
    topNotes: ["Pink Grapefruit", "Mandarin"],
    heartNotes: ["Lily of the Valley", "Muguet"],
    baseNotes: ["Musks", "Light Woods"],
    fullDescription: "A study in minimalism and purity.",
  },
];
