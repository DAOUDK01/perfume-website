import Link from "next/link";

const policySections = [
  {
    id: "terms-conditions",
    title: "Terms & Conditions",
    points: [
      "By placing an order, you agree that all information provided is accurate and complete.",
      "Prices, product availability, and delivery timelines can change without prior notice.",
      "Orders may be cancelled if fraud, payment issues, or stock errors are detected.",
    ],
  },
  {
    id: "damaged-or-incorrect-products",
    title: "Damaged or Incorrect Products",
    points: [
      "If your parcel arrives damaged or incorrect, contact us within 48 hours of delivery.",
      "Share your order number and clear photos of the item and packaging.",
      "After verification, we will provide a replacement or an appropriate resolution.",
    ],
  },
  {
    id: "shipping-delivery",
    title: "Shipping & Delivery",
    points: [
      "Delivery timelines are estimates and can vary due to location, weather, or courier delays.",
      "Please ensure your address and contact details are correct to avoid failed deliveries.",
      "Additional delivery attempts or re-routing charges may apply in some cases.",
    ],
  },
  {
    id: "returns-refunds",
    title: "Returns & Refunds",
    points: [
      "For hygiene reasons, opened fragrances are generally not returnable unless defective.",
      "Approved refunds are processed to the original payment method or store credit.",
      "Refund processing times depend on your bank or payment provider.",
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    points: [
      "We only collect personal data required to process orders and provide customer support.",
      "Your data is never sold to third parties for advertising purposes.",
      "You can request updates or deletion of your data by contacting our support team.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] pt-28 pb-20">
      <section className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-gray-500 font-medium mb-4">
            Legal & Support
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 tracking-tight mb-4">
            Terms & Policies
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 font-light leading-relaxed">
            Please read these guidelines before placing an order. They explain
            order handling, damaged product support, privacy, and return rules.
          </p>
        </div>

        <div className="space-y-5">
          {policySections.map((section) => (
            <article
              id={section.id}
              key={section.title}
              className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white p-6 md:p-7"
            >
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3 text-gray-700 font-light leading-relaxed text-sm md:text-base">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-600 font-light mb-4">
            Need help with a policy-related request?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
