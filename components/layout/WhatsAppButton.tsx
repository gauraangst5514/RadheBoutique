"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_BRAND_WHATSAPP?.replace(/\D/g, '');

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in your jewellery collection`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} color="white" />
    </a>
  );
}
