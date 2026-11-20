import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tryOnOptions } from "@/lib/tryon";
import { TryOnClient } from "@/components/tryon/TryOnClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.getProductBySlug(slug);
  return { title: p ? `Try on: ${p.name}` : "Try on", robots: { index: false } };
}

export default async function TryOnPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ v?: string }> }) {
  const { slug } = await params;
  const { v } = await searchParams;
  const p = await db.getProductBySlug(slug);
  if (!p || !p.active || !p.tryOn) notFound();
  const options = tryOnOptions(p);
  if (!options.length) notFound();
  return <TryOnClient product={p} kind={p.tryOn} options={options} initialVariant={v} />;
}
