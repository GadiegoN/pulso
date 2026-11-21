import React from 'react';
import { requireAdmin } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { spots, radioSchedules, establishments, cities } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { connection } from 'next/server';
import RadioManagerView from './RadioManagerView';

export const instant = false;

export default async function AdminRadioPage() {
  await connection();
  await requireAdmin();

  // Buscar todos os spots com estabelecimentos vinculados
  const allSpots = await db
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
    .orderBy(desc(spots.createdAt));

  // Buscar agendamentos da grade com spots e cidades vinculadas
  const allSchedules = await db
    .select({
      id: radioSchedules.id,
      scheduledTime: radioSchedules.scheduledTime,
      daysOfWeek: radioSchedules.daysOfWeek,
      isActive: radioSchedules.isActive,
      spotId: radioSchedules.spotId,
      spotTitle: spots.title,
      spotAudioUrl: spots.audioUrl,
      cityId: radioSchedules.cityId,
      cityName: cities.name,
      cityState: cities.state,
      createdAt: radioSchedules.createdAt,
    })
    .from(radioSchedules)
    .leftJoin(spots, eq(radioSchedules.spotId, spots.id))
    .leftJoin(cities, eq(radioSchedules.cityId, cities.id))
    .orderBy(radioSchedules.scheduledTime);

  // Cidades e estabelecimentos para formulários
  const allCities = await db.select().from(cities).orderBy(cities.name);
  const allEstablishments = await db.select().from(establishments).orderBy(establishments.name);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Gestão da Rádio Digital Local
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload de vinhetas e spots comerciais parceiros, programação semanal e monitoramento de streaming
        </p>
      </div>

      <RadioManagerView
        spots={allSpots}
        schedules={allSchedules}
        cities={allCities}
        establishments={allEstablishments}
      />
    </div>
  );
}
