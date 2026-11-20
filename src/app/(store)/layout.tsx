import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <RevealOnScroll />
    </>
  );
}
