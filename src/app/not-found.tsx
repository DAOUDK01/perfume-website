import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-4xl font-serif font-light mb-4 text-gray-900">
        Page Not Found
      </h2>
      <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-black border-b border-black pb-1 hover:opacity-70 transition-opacity font-light"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
