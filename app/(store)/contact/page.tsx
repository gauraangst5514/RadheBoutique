"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

const BRAND_PHONE = "+919022013489";
const BRAND_EMAIL = process.env.NEXT_PUBLIC_BRAND_EMAIL || "info@radheboutique.com";
const BRAND_CITY = process.env.NEXT_PUBLIC_BRAND_CITY || "Mumbai";
const INSTAGRAM = process.env.NEXT_PUBLIC_BRAND_INSTAGRAM || "@radheboutique";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in Name, Phone, and Message");
      return;
    }
    setSending(true);

    // Build WhatsApp message from the contact form and open it
    const msg = [
      `Hi, I'm reaching out via your website.`,
      ``,
      `Name: ${form.name}`,
      form.email ? `Email: ${form.email}` : "",
      `Phone: ${form.phone}`,
      form.subject ? `Subject: ${form.subject}` : "",
      ``,
      `Message:`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/91${BRAND_PHONE.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    toast.success("Opening WhatsApp...");
    setSending(false);
  };

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-bg text-ivory">
        {/* Hero */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="w-16 h-px bg-gold mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Get in Touch</h1>
            <p className="text-ivory/60 max-w-2xl mx-auto text-lg">
              We&apos;d love to hear from you. Whether it&apos;s a custom order, a question about our 
              collection, or just to say hello — reach out and we&apos;ll get back to you within the hour.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a
                href={`https://wa.me/91${BRAND_PHONE.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent("Hi! I have a query.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface border border-border rounded-lg p-6 text-center hover:border-gold transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <MessageCircle className="text-gold" size={24} />
                </div>
                <h3 className="font-semibold mb-1">WhatsApp</h3>
                <p className="text-gold text-sm">{BRAND_PHONE}</p>
                <p className="text-ivory/50 text-xs mt-1">Fastest response</p>
              </a>

              <a
                href={`tel:${BRAND_PHONE}`}
                className="bg-surface border border-border rounded-lg p-6 text-center hover:border-gold transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Phone className="text-gold" size={24} />
                </div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-gold text-sm">{BRAND_PHONE}</p>
                <p className="text-ivory/50 text-xs mt-1">Mon–Sat, 10 AM – 8 PM</p>
              </a>

              <a
                href={`mailto:${BRAND_EMAIL}`}
                className="bg-surface border border-border rounded-lg p-6 text-center hover:border-gold transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Mail className="text-gold" size={24} />
                </div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gold text-sm break-all">{BRAND_EMAIL}</p>
                <p className="text-ivory/50 text-xs mt-1">We reply within 24 hours</p>
              </a>

              <div className="bg-surface border border-border rounded-lg p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-gold" size={24} />
                </div>
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p className="text-gold text-sm">{BRAND_CITY}, India</p>
                <p className="text-ivory/50 text-xs mt-1">By appointment only</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form + Info */}
        <section className="py-16 bg-surface/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <h2 className="font-display text-2xl text-gold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number *"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Email (optional)"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <Input
                      label="Subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Custom Order Inquiry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-ivory">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 bg-bg border border-border rounded-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                    />
                  </div>
                  <Button type="submit" isLoading={sending} className="w-full sm:w-auto">
                    <Send size={16} className="mr-2" />
                    Send via WhatsApp
                  </Button>
                  <p className="text-xs text-ivory/40 mt-2">
                    Your message will be sent through WhatsApp for the fastest response.
                  </p>
                </form>
              </div>

              {/* Info Panel */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hours */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-gold" size={20} />
                    <h3 className="font-semibold">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm text-ivory/70">
                    <div className="flex justify-between">
                      <span>Monday – Saturday</span>
                      <span className="text-ivory">10:00 AM – 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-ivory/50">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="space-y-3">
                    <a
                      href={`https://instagram.com/${INSTAGRAM.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-ivory/70 hover:text-gold transition-colors"
                    >
                      <Instagram size={20} />
                      <span>{INSTAGRAM}</span>
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-ivory/70 hover:text-gold transition-colors"
                    >
                      <Facebook size={20} />
                      <span>Radhe Boutique</span>
                    </a>
                  </div>
                </div>

                {/* Quick Inquiry CTA */}
                <div className="bg-gold/5 border border-gold/30 rounded-lg p-6 text-center">
                  <h3 className="font-display text-xl text-gold mb-2">Need Immediate Help?</h3>
                  <p className="text-ivory/60 text-sm mb-4">
                    Skip the form — message us directly on WhatsApp for instant support.
                  </p>
                  <a
                    href={`https://wa.me/919022013489?text=${encodeURIComponent("Hi! I need help with something.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-sm font-semibold hover:bg-green-700 transition-colors text-sm"
                  >
                    <MessageCircle size={18} />
                    Chat Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="font-display text-3xl text-gold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do you offer custom jewellery design?",
                  a: "Yes! Share your vision on WhatsApp and our designers will create a sketch for you within 48 hours. Custom pieces take 2-4 weeks to craft.",
                },
                {
                  q: "Is your gold BIS Hallmarked?",
                  a: "Absolutely. Every gold piece comes with a BIS Hallmark certificate and purity guarantee. Diamonds are GIA certified.",
                },
                {
                  q: "What is your return policy?",
                  a: "We offer a 30-day return policy for unworn items in original packaging. Custom-made pieces are non-returnable but covered under lifetime maintenance.",
                },
                {
                  q: "How does the payment process work?",
                  a: "After placing your order, we'll share a payment QR code via WhatsApp. Once payment is confirmed, we pack and ship your order with full insurance.",
                },
                {
                  q: "Do you ship across India?",
                  a: "Yes, we ship pan-India with insured delivery. Orders above ₹499 get free shipping. Standard delivery takes 5-7 days; express takes 2-3 days.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="bg-surface border border-border rounded-lg group"
                >
                  <summary className="cursor-pointer p-5 flex items-center justify-between font-semibold hover:text-gold transition-colors">
                    {faq.q}
                    <span className="text-gold text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-ivory/70 text-sm leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="border-t border-border">
          <div className="relative h-64 md:h-80 bg-surface flex items-center justify-center">
            <div className="text-center">
              <MapPin className="text-gold mx-auto mb-3" size={32} />
              <p className="font-display text-2xl text-gold mb-1">{BRAND_CITY}, India</p>
              <p className="text-ivory/60 text-sm">By appointment only • WhatsApp to schedule a visit</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
