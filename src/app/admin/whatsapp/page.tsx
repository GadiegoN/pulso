import React from 'react';
import { requireStaff } from '@/lib/auth/server';
import { db } from '@/lib/db';
import {
  whatsappChannels,
  whatsappBroadcasts,
  cities,
  establishments,
  profiles,
} from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { connection } from 'next/server';
import WhatsappHubView from './WhatsappHubView';

export const instant = false;

export default async function AdminWhatsappPage() {
  await connection();
  await requireStaff();

  const allChannels = await db
    .select({
      id: whatsappChannels.id,
      name: whatsappChannels.name,
      neighborhoodOrScope: whatsappChannels.neighborhoodOrScope,
      inviteLink: whatsappChannels.inviteLink,
      memberCount: whatsappChannels.memberCount,
      isActive: whatsappChannels.isActive,
      cityId: whatsappChannels.cityId,
      cityName: cities.name,
      cityState: cities.state,
      createdAt: whatsappChannels.createdAt,
    })
    .from(whatsappChannels)
    .leftJoin(cities, eq(whatsappChannels.cityId, cities.id))
    .orderBy(desc(whatsappChannels.createdAt));

  const allBroadcasts = await db
    .select({
      id: whatsappBroadcasts.id,
      category: whatsappBroadcasts.category,
      title: whatsappBroadcasts.title,
      messageBody: whatsappBroadcasts.messageBody,
      formattedMessage: whatsappBroadcasts.formattedMessage,
      ctaUrl: whatsappBroadcasts.ctaUrl,
      dispatchedAt: whatsappBroadcasts.dispatchedAt,
      cityName: cities.name,
      cityState: cities.state,
      channelName: whatsappChannels.name,
      establishmentName: establishments.name,
      authorName: profiles.fullName,
      authorEmail: profiles.email,
    })
    .from(whatsappBroadcasts)
    .leftJoin(cities, eq(whatsappBroadcasts.cityId, cities.id))
    .leftJoin(whatsappChannels, eq(whatsappBroadcasts.channelId, whatsappChannels.id))
    .leftJoin(establishments, eq(whatsappBroadcasts.establishmentId, establishments.id))
    .leftJoin(profiles, eq(whatsappBroadcasts.authorId, profiles.id))
    .orderBy(desc(whatsappBroadcasts.dispatchedAt));

  const allCities = await db
    .select()
    .from(cities)
    .where(eq(cities.isActive, true))
    .orderBy(cities.name);

  const allEstablishments = await db
    .select({
      id: establishments.id,
      name: establishments.name,
    })
    .from(establishments)
    .where(eq(establishments.isActive, true))
    .orderBy(establishments.name);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Central de WhatsApp & Comunicados Comunitários
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gestão de listas de transmissão, comunicados de utilidade pública, alertas da cidade e informes comerciais
        </p>
      </div>

      <WhatsappHubView
        channels={allChannels}
        broadcasts={allBroadcasts}
        cities={allCities}
        establishments={allEstablishments}
      />
    </div>
  );
}
