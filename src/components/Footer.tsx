import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-light mb-4">e&apos;eora</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Quiet luxury. Thoughtfully crafted fragrances that speak softly.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif font-light mb-4 text-sm uppercase tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <Link href="/fragrances" className="hover:text-black transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/product/essence-noir" className="hover:text-black transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-black transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-serif font-light mb-4 text-sm uppercase tracking-wide">
              About
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif font-light mb-4 text-sm uppercase tracking-wide">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-light">
          <p>&copy; 2026 e&apos;eora. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
