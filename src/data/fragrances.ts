export interface Fragrance {
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

export const fragrances: Fragrance[] = [
  {
    id: "essence-noir",
    name: "Essence Noir",
    tagline: "Whispers of midnight elegance",
    price: 185,
    image: "#1a1a1a",
    topNotes: ["Bergamot", "Black Currant"],
    heartNotes: ["Iris", "Rose", "Violet"],
    baseNotes: ["Vetiver", "Musk", "Sandalwood"],
    fullDescription:
      "A captivating fragrance that embodies quiet luxury. Essence Noir opens with fresh citrus notes, transitioning into a sophisticated floral heart, settling into a warm, sensual base. Perfect for those who appreciate understated elegance.",
  },
  {
    id: "luminous-trace",
    name: "Luminous Trace",
    tagline: "Where light touches the soul",
    price: 175,
    image: "#f4d03f",
    topNotes: ["Lemon", "Grapefruit"],
    heartNotes: ["Gardenia", "Peony", "Freesia"],
    baseNotes: ["Amber", "Cashmere Wood", "Musk"],
    fullDescription:
      "An ethereal composition that captures the essence of dawn. Luminous Trace features bright citrus opening into delicate florals, with a creamy, warm base. Ideal for creating a lasting impression with subtle grace.",
  },
  {
    id: "velvet-sanctuary",
    name: "Velvet Sanctuary",
    tagline: "A refuge in refined fragrance",
    price: 195,
    image: "#c8547d",
    topNotes: ["Pink Pepper", "Cardamom"],
    heartNotes: ["Tuberose", "Orange Blossom", "Jasmine"],
    baseNotes: ["Vanilla", "Oud", "Cedarwood"],
    fullDescription:
      "Luxuriously wrapped in comfort. Velvet Sanctuary combines spiced top notes with exotic florals and a rich, woody base. This fragrance envelops you in warmth and sophistication, making it the perfect evening companion.",
  },
  {
    id: "crystalline-veil",
    name: "Crystalline Veil",
    tagline: "Pure, transparent, timeless",
    price: 165,
    image: "#e8f4f8",
    topNotes: ["Pink Grapefruit", "Mandarin"],
    heartNotes: ["Lily of the Valley", "Muguet"],
    baseNotes: ["Musks", "Light Woods"],
    fullDescription:
      "Crystalline Veil is a study in minimalism and purity. This fresh, delicate fragrance features bright citrus, subtle florals, and a clean base. Perfect for those who believe in letting their presence speak louder than their perfume.",
  },
];
