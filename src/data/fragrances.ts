export interface Fragrance {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;  // Now uses full path
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  fullDescription: string;
}

export const fragrances: Fragrance[] = [
  {
    id: "essence-noir",
    name: "Bold Beauty",
    tagline: "Whispers of midnight elegance",
    price: 2000,
    image: "/assets/bb.jpg",  // Full path - ensure file exists in public/assets/
    topNotes: ["Bergamot", "Black Currant"],
    heartNotes: ["Iris", "Rose", "Violet"],
    baseNotes: ["Vetiver", "Musk", "Sandalwood"],
    fullDescription: "A captivating fragrance that embodies quiet luxury.",
  },
  {
    id: "luminous-trace",
    name: "Blue Ethereal",
    tagline: "Where light touches the soul",
    price: 2000,
    image: "/assets/blueEthereal.jpg",
    topNotes: ["Lemon", "Grapefruit"],
    heartNotes: ["Gardenia", "Peony", "Freesia"],
    baseNotes: ["Amber", "Cashmere Wood", "Musk"],
    fullDescription: "An ethereal composition capturing the essence of dawn.",
  },
  {
    id: "velvet-sanctuary",
    name: "Flawless",
    tagline: "A refuge in refined fragrance",
    price: 1800,
    image: "/assets/flawless.jpg",  // Updated to match your map
    topNotes: ["Pink Pepper", "Cardamom"],
    heartNotes: ["Tuberose", "Orange Blossom", "Jasmine"],
    baseNotes: ["Vanilla", "Oud", "Cedarwood"],
    fullDescription: "Luxuriously wrapped in warmth and sophistication.",
  },
  {
    id: "crystalline-veil",
    name: "Seven",
    tagline: "Pure, transparent, timeless",
    price: 2000,
    image: "/assets/seven.jpg",  // Updated to match your map
    topNotes: ["Pink Grapefruit", "Mandarin"],
    heartNotes: ["Lily of the Valley", "Muguet"],
    baseNotes: ["Musks", "Light Woods"],
    fullDescription: "A study in minimalism and purity.",
  },
  {
    id: "blackrock-elixir",
    name: "Black Rock ",
    tagline: "Deep, mysterious, powerful",
    price: 1800,
    image: "/assets/blackrock.jpg",
    topNotes: ["Black Pepper", "Saffron"],
    heartNotes: ["Dark Rose", "Oud", "Incense"],
    baseNotes: ["Leather", "Amber", "Patchouli"],
    fullDescription: "An intense fragrance that commands attention.",
  },
  {
    id: "zero-gravity",
    name: "Zero ",
    tagline: "Weightless elegance redefined",
    price: 2000,
    image: "/assets/zero.jpg",
    topNotes: ["Aldehydes", "Bergamot", "Neroli"],
    heartNotes: ["Jasmine", "Lily", "Iris"],
    baseNotes: ["White Musk", "Amber", "Vanilla"],
    fullDescription: "A floating sensation of pure sophistication.",
  },
];
