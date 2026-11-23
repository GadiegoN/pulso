import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import {
  establishments,
  categories,
  cities,
  spots,
  whatsappBroadcasts,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { connection } from 'next/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import EstablishmentShowcaseClient from './EstablishmentShowcaseClient';

export const instant = false;

export default async function EstablishmentShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;

  const records = await db
    .select({
      id: establishments.id,
      name: establishments.name,
      slug: establishments.slug,
      description: establishments.description,
      whatsapp: establishments.whatsapp,
      address: establishments.address,
      isFeatured: establishments.isFeatured,
      isActive: establishments.isActive,
      cityName: cities.name,
      cityState: cities.state,
      categoryName: categories.name,
    })
    .from(establishments)
    .innerJoin(cities, eq(establishments.cityId, cities.id))
    .innerJoin(categories, eq(establishments.categoryId, categories.id))
    .where(and(eq(establishments.slug, slug), eq(establishments.isActive, true)))
    .limit(1);

  const establishment = records[0];
  if (!establishment) {
    notFound();
  }

  // Spots de áudio ativos deste comércio na Rádio Digital
  const partnerSpots = await db
    .select({
      id: spots.id,
      title: spots.title,
      audioUrl: spots.audioUrl,
      durationSeconds: spots.durationSeconds,
      createdAt: spots.createdAt,
    })
    .from(spots)
    .where(and(eq(spots.establishmentId, establishment.id), eq(spots.isActive, true)))
    .orderBy(desc(spots.createdAt));

  // Comunicados e ofertas recentes deste comércio no Mural da Cidade
  const partnerBroadcasts = await db
    .select({
      id: whatsappBroadcasts.id,
      title: whatsappBroadcasts.title,
      messageBody: whatsappBroadcasts.messageBody,
      ctaUrl: whatsappBroadcasts.ctaUrl,
      dispatchedAt: whatsappBroadcasts.dispatchedAt,
    })
    .from(whatsappBroadcasts)
    .where(eq(whatsappBroadcasts.establishmentId, establishment.id))
    .orderBy(desc(whatsappBroadcasts.dispatchedAt))
    .limit(6);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <EstablishmentShowcaseClient
          establishment={establishment}
          spots={partnerSpots}
          broadcasts={partnerBroadcasts}
        />
      </main>

      <Footer />
    </div>
  );
}
