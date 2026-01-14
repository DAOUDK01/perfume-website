import Button from "@/src/components/Button";
import { fragrances } from "@/src/data/fragrances";
import Link from "next/link";

export const metadata = {
  title: "Fragrances | e'eora",
  description: "Explore our complete collection of luxury fragrances",
};

export default function FragrancesPage() {
  return (
    <div className="bg-white pt-24">
      {/* Page Header */}
      <section className="border-b border-gray-200 py-12 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-serif mb-2 font-light">
            All Fragrances
          </h1>
          <p className="text-gray-600">
            Our complete collection of fragrances.
          </p>
        </div>
      </section>

      {/* Fragrances Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragrances.map((fragrance) => (
              <div key={fragrance.id} className="group cursor-pointer">
                {/* Color Block */}
                <div 
                  className="w-full h-80 mb-4 rounded overflow-hidden group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: fragrance.image }}
                ></div>
                <h3 className="text-lg font-serif font-light mb-1">{fragrance.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{fragrance.tagline}</p>
                <div className="flex justify-between items-center">
                  <span>${fragrance.price}</span>
                  <Link href="/checkout">
                    <button className="text-sm border-b border-black hover:text-gray-600 transition-colors">
                      Add to Cart
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
