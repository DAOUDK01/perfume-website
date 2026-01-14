import Button from "@/src/components/Button";

export const metadata = {
  title: "Contact | e'eora",
  description: "Get in touch with the e'eora team",
};

export default function ContactPage() {
  return (
    <div className="bg-white pt-32">
      {/* Page Header */}
      <section className="border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
            Have questions or want to share your e&apos;eora experience? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light tracking-wider mb-12">
                Send us a message
              </h2>

              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button variant="primary" className="w-full">
                  SEND MESSAGE
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-light tracking-wider mb-12">
                Other ways to connect
              </h2>

              <div className="space-y-12">
                {/* Email */}
                <div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Email
                  </p>
                  <a
                    href="mailto:hello@eora.com"
                    className="text-lg font-light hover:text-gray-600 transition-colors"
                  >
                    hello@eora.com
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Phone
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-lg font-light hover:text-gray-600 transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>

                {/* Social */}
                <div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Follow
                  </p>
                  <div className="flex gap-6">
                    <a
                      href="#instagram"
                      className="text-lg font-light hover:text-gray-600 transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="#twitter"
                      className="text-lg font-light hover:text-gray-600 transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                    Hours
                  </p>
                  <div className="space-y-2 text-sm font-light">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 pt-2">(All times in EST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map or Additional Info */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light tracking-wider mb-6">
            Thank you for your interest
          </h2>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you have questions about our fragrances, feedback, or just
            want to share your thoughts, we're here and we're listening.
            Expect a response within 24 business hours.
          </p>
        </div>
      </section>
    </div>
  );
}
