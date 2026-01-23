"use client";

import Confirmation from "@/src/components/Confirmation";

export default function ContactConfirmationPage() {
  return (
    <Confirmation
      title="Message Received"
      message="Thank you for reaching out. We've received your message and will get back to you within 24 hours."
      details={
        <p className="text-sm font-light">
          We appreciate your interest in <span className="font-agrandir">e'eora</span>. Our team is reviewing your
          message.
        </p>
      }
      primaryAction={{ label: "Return Home", href: "/" }}
      secondaryAction={{ label: "Back to Contact", href: "/contact" }}
    />
  );
}
