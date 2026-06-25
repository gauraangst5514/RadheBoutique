import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-bg text-ivory py-24 px-4">
      <div className="container mx-auto">
        <h1 className="heading-1 text-gold mb-4">Search</h1>
        <p className="text-ivory/60 mb-8">Search functionality will be implemented here</p>
        <Link href="/shop" className="text-gold hover:underline">
          Browse All Products →
        </Link>
      </div>
    </div>
  );
}
