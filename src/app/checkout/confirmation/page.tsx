"use client";

import Confirmation from "@/components/Confirmation";
import { useEffect, useState } from "react";

export default function CheckoutConfirmationPage() {
  const [orderEmail, setOrderEmail] = useState("");

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem("lastOrder") || "{}");
    if (order.email) {
      setOrderEmail(order.email);
    }
  }, []);

  return (
    <Confirmation
      title="Order Confirmed"
      message={`Thank you for your purchase. We&apos;ve sent a confirmation email to ${orderEmail}. Your order will be shipped within 2-3 business days.`}
      details={
        <div className="text-left space-y-3">
          <p className="text-sm font-light">
            <strong className="font-normal">Order confirmation</strong> has been
            sent to your email.
          </p>
          <p className="text-sm font-light">
            <strong className="font-normal">Tracking information</strong> will be
            available shortly.
          </p>
          <p className="text-sm font-light text-gray-500">
            Questions? Contact hello@eora.com
          </p>
        </div>
      }
      primaryAction={{ label: "Continue Shopping", href: "/fragrances" }}
      secondaryAction={{ label: "Return Home", href: "/" }}
    />
  );
}
