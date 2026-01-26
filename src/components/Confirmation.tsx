import Link from "next/link";
import Button from "@/components/Button";

interface ConfirmationProps {
  title: string;
  message: string;
  details?: React.ReactNode;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function Confirmation({
  title,
  message,
  details,
  primaryAction = { label: "Continue Shopping", href: "/" },
  secondaryAction = { label: "View Orders", href: "/" },
}: ConfirmationProps) {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Indicator - Simple circle */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-light tracking-wide font-serif mb-6">
          {title}
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-12 font-light leading-relaxed">
          {message}
        </p>

        {/* Details */}
        {details && (
          <div className="bg-gray-50 border border-gray-200 rounded p-8 mb-12">
            {details}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          {primaryAction && (
            <Link href={primaryAction.href}>
              <Button variant="primary">{primaryAction.label}</Button>
            </Link>
          )}
          {secondaryAction && (
            <Link href={secondaryAction.href}>
              <Button variant="secondary">{secondaryAction.label}</Button>
            </Link>
          )}
        </div>

        {/* Trust elements */}
        <div className="mt-16 pt-8 border-t border-gray-200 space-y-3 text-sm text-gray-600 font-light">
          <p>Thank you for your trust. We&apos;ll be in touch shortly.</p>
        </div>
      </div>
    </div>
  );
}
