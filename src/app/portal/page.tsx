import React from 'react';
import { requireMerchant } from '@/lib/auth/server';
import { db } from '@/lib/db';
import {
  establishments,
  categories,
  cities,
  spots,
  radioSchedules,
  spotRequests,
} from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { connection } from 'next/server';
import PortalClientView from './PortalClientView';

export const instant = false;

export default async function MerchantPortalPage() {
  await connection();
  const profile = await requireMerchant();

  // Busca estabelecimentos vinculados ao comerciante (ou todos se for admin inspecionando o portal)
  const myEstablishments = await db
    .select({
      id: establishments.id,
      name: establishments.name,
      slug: establishments.slug,
      description: establishments.description,
      whatsapp: establishments.whatsapp,
      address: establishments.address,
      whatsappClicks: establishments.whatsappClicks,
      isFeatured: establishments.isFeatured,
      isActive: establishments.isActive,
      categoryName: categories.name,
      cityName: cities.name,
      cityState: cities.state,
      ownerId: establishments.ownerId,
      updatedAt: establishments.updatedAt,
    })
    .from(establishments)
    .leftJoin(categories, eq(establishments.categoryId, categories.id))
    .leftJoin(cities, eq(establishments.cityId, cities.id))
    .where(
      profile.role === 'admin'
        ? undefined
        : eq(establishments.ownerId, profile.id)
    )
    .orderBy(desc(establishments.createdAt));

  const establishmentIds = myEstablishments.map((e) => e.id);

  // Busca spots vinculados aos estabelecimentos do comerciante
  const mySpots =
    establishmentIds.length > 0
      ? await db
          .select({
            id: spots.id,
            title: spots.title,
            audioUrl: spots.audioUrl,
            durationSeconds: spots.durationSeconds,
            isActive: spots.isActive,
            establishmentId: spots.establishmentId,
            establishmentName: establishments.name,
            createdAt: spots.createdAt,
          })
          .from(spots)
          .leftJoin(establishments, eq(spots.establishmentId, establishments.id))
          .where(inArray(spots.establishmentId, establishmentIds))
          .orderBy(desc(spots.createdAt))
      : [];

  const spotIds = mySpots.map((s) => s.id);

  // Busca horários programados para os spots do comerciante
  const mySchedules =
    spotIds.length > 0
      ? await db
          .select({
            id: radioSchedules.id,
            spotId: radioSchedules.spotId,
            spotTitle: spots.title,
            scheduledTime: radioSchedules.scheduledTime,
            daysOfWeek: radioSchedules.daysOfWeek,
            isActive: radioSchedules.isActive,
          })
          .from(radioSchedules)
          .leftJoin(spots, eq(radioSchedules.spotId, spots.id))
          .where(inArray(radioSchedules.spotId, spotIds))
          .orderBy(radioSchedules.scheduledTime)
      : [];

  // Busca solicitações de novos spots enviadas pelo comerciante
  const mySpotRequests =
    establishmentIds.length > 0
      ? await db
          .select({
            id: spotRequests.id,
            establishmentId: spotRequests.establishmentId,
            establishmentName: establishments.name,
            title: spotRequests.title,
            scriptNotes: spotRequests.scriptNotes,
            preferredTimeSlot: spotRequests.preferredTimeSlot,
            status: spotRequests.status,
            adminFeedback: spotRequests.adminFeedback,
            createdAt: spotRequests.createdAt,
          })
          .from(spotRequests)
          .leftJoin(establishments, eq(spotRequests.establishmentId, establishments.id))
          .where(inArray(spotRequests.establishmentId, establishmentIds))
          .orderBy(desc(spotRequests.createdAt))
      : [];

  return (
    <PortalClientView
      profile={{
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
      }}
      establishments={myEstablishments}
      spots={mySpots}
      schedules={mySchedules}
      spotRequests={mySpotRequests}
    />
  );
}
