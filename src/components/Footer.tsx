import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white  border-t border-gray-200 ">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-3xl font-agrandir font-bold tracking-tighter text-black " style={{ letterSpacing: "-0.04em" }}>e'eora</h3>
            <p className="text-sm text-gray-600  font-light leading-relaxed max-w-xs">
              Quiet luxury. Thoughtfully crafted fragrances that speak softly.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif font-light mb-6 text-sm uppercase tracking-wide text-gray-900 ">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-gray-600  font-light">
              <li>
                <Link href="/fragrances" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/fragrances" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-serif font-light mb-6 text-sm uppercase tracking-wide text-gray-900 ">
              About
            </h4>
            <ul className="space-y-3 text-sm text-gray-600  font-light">
              <li>
                <Link href="/about" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif font-light mb-6 text-sm uppercase tracking-wide text-gray-900 ">
              Connect
            </h4>
            <ul className="space-y-3 text-sm text-gray-600  font-light">
              <li>
                <a href="https://www.instagram.com/eeora" target="_blank" rel="noopener noreferrer" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/eeora" target="_blank" rel="noopener noreferrer" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com/eeora" target="_blank" rel="noopener noreferrer" className="hover:text-black  hover:pl-2 transition-all duration-300 block">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200  my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600  font-light">
          <p>&copy; 2026 <span className="font-agrandir">e'eora</span>. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black  transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black  transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-black  transition-colors">
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
