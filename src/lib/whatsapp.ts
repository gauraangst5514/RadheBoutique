import { store } from "@/config/store";

export function waLink(text: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function waProductText(name: string, variant: string | null, price: number, url: string) {
  return `Hi Radhe Boutique! I want to order:\n${name}${variant ? ` (${variant})` : ""} – ₹${price}\n${url}`;
}
