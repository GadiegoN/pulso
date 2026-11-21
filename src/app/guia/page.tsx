import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { establishments, categories, cities } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { connection } from 'next/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DigitalRadioPlayer } from '@/components/DigitalRadioPlayer';
import GuiaClientView from './GuiaClientView';

export const instant = false;

export const metadata: Metadata = {
  title: 'Guia Comercial & Parceiros | PULSO Conquista - MG',
  description:
    'Encontre lojas, farmácias, supermercados e serviços locais em Conquista - MG com atendimento direto pelo WhatsApp oficial.',
};

export default async function GuiaComercialPage() {
  await connection();

  const allCategories = await db.select().from(categories).orderBy(categories.name);

  const activeEstablishments = await db
    .select({
      id: establishments.id,
      name: establishments.name,
      slug: establishments.slug,
      whatsapp: establishments.whatsapp,
      address: establishments.address,
      description: establishments.description,
      cityName: cities.name,
      cityState: cities.state,
      categoryId: establishments.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(establishments)
    .innerJoin(cities, eq(establishments.cityId, cities.id))
    .innerJoin(categories, eq(establishments.categoryId, categories.id))
    .where(eq(establishments.isActive, true))
    .orderBy(desc(establishments.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <GuiaClientView
          initialCategories={allCategories}
          establishments={activeEstablishments}
        />
      </main>

      <DigitalRadioPlayer />
      <Footer />
    </div>
  );
}
