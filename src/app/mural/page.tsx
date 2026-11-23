import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import {
  whatsappBroadcasts,
  whatsappChannels,
  cities,
  establishments,
} from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { connection } from 'next/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import MuralClientView from './MuralClientView';

export const instant = false;

export const metadata: Metadata = {
  title: 'Mural da Cidade & Grupos Oficiais | PULSO Conquista - MG',
  description:
    'Comunicados oficiais de utilidade pública, alertas da cidade, informes comerciais e acesso direto aos grupos comunitários de WhatsApp de Conquista - MG.',
};

export default async function MuralCidadePage() {
  await connection();

  const broadcasts = await db
    .select({
      id: whatsappBroadcasts.id,
      category: whatsappBroadcasts.category,
      title: whatsappBroadcasts.title,
      messageBody: whatsappBroadcasts.messageBody,
      ctaUrl: whatsappBroadcasts.ctaUrl,
      dispatchedAt: whatsappBroadcasts.dispatchedAt,
      cityName: cities.name,
      cityState: cities.state,
      channelName: whatsappChannels.name,
      establishmentName: establishments.name,
      establishmentWhatsapp: establishments.whatsapp,
    })
    .from(whatsappBroadcasts)
    .leftJoin(cities, eq(whatsappBroadcasts.cityId, cities.id))
    .leftJoin(whatsappChannels, eq(whatsappBroadcasts.channelId, whatsappChannels.id))
    .leftJoin(establishments, eq(whatsappBroadcasts.establishmentId, establishments.id))
    .orderBy(desc(whatsappBroadcasts.dispatchedAt));

  const activeChannels = await db
    .select({
      id: whatsappChannels.id,
      name: whatsappChannels.name,
      neighborhoodOrScope: whatsappChannels.neighborhoodOrScope,
      inviteLink: whatsappChannels.inviteLink,
      memberCount: whatsappChannels.memberCount,
      cityName: cities.name,
      cityState: cities.state,
    })
    .from(whatsappChannels)
    .leftJoin(cities, eq(whatsappChannels.cityId, cities.id))
    .where(eq(whatsappChannels.isActive, true))
    .orderBy(whatsappChannels.name);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <MuralClientView broadcasts={broadcasts} channels={activeChannels} />
      </main>

      <Footer />
    </div>
  );
}
