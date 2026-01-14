export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-6">
          Welcome to Perfume Store
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Discover the finest fragrances from around the world
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">Premium Selection</h2>
            <p className="text-gray-600">
              Curated collection of luxury perfumes from top brands
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">Fast Delivery</h2>
            <p className="text-gray-600">
              Quick and secure shipping to your doorstep
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold mb-3">Expert Support</h2>
            <p className="text-gray-600">
              Professional guidance to find your perfect scent
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
