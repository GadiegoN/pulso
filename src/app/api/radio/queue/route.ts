import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { spots, radioSchedules, establishments, cities } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { connection } from 'next/server';

export const instant = false;

export interface RadioQueueItem {
  id: string;
  spotId: string;
  title: string;
  audioUrl: string;
  durationSeconds: number;
  establishmentName: string | null;
  establishmentWhatsapp: string | null;
  cityName: string | null;
  scheduledTime: string | null;
  isScheduledForToday: boolean;
  priorityScore: number;
}

/**
 * Endpoint de Automação e Sequenciamento da Rádio Digital (/api/radio/queue).
 * Calcula a fila de transmissão em tempo real combinando:
 * 1. Spots agendados na grade semanal para o dia da semana atual ordenados por proximidade de horário.
 * 2. Spots ativos em rotação contínua da rede local.
 */
export async function GET() {
  await connection();

  try {
    const now = new Date();
    // Dia da semana no Brasil (0 = Domingo, 1 = Segunda ... 6 = Sábado)
    const currentDay = String(now.getDay());
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 1. Buscar todos os spots ativos com seus estabelecimentos
    const activeSpots = await db
      .select({
        id: spots.id,
        title: spots.title,
        audioUrl: spots.audioUrl,
        durationSeconds: spots.durationSeconds,
        establishmentId: spots.establishmentId,
        establishmentName: establishments.name,
        establishmentWhatsapp: establishments.whatsapp,
        createdAt: spots.createdAt,
      })
      .from(spots)
      .leftJoin(establishments, eq(spots.establishmentId, establishments.id))
      .where(eq(spots.isActive, true))
      .orderBy(desc(spots.createdAt));

    // 2. Buscar agendamentos ativos da grade
    const activeSchedules = await db
      .select({
        id: radioSchedules.id,
        spotId: radioSchedules.spotId,
        scheduledTime: radioSchedules.scheduledTime,
        daysOfWeek: radioSchedules.daysOfWeek,
        cityName: cities.name,
      })
      .from(radioSchedules)
      .innerJoin(spots, eq(radioSchedules.spotId, spots.id))
      .leftJoin(cities, eq(radioSchedules.cityId, cities.id))
      .where(and(eq(radioSchedules.isActive, true), eq(spots.isActive, true)));

    const spotMap = new Map(activeSpots.map((s) => [s.id, s]));
    const queue: RadioQueueItem[] = [];
    const includedSpotIds = new Set<string>();

    // 3. Processar spots agendados para o dia de hoje com cálculo de proximidade temporal
    for (const sch of activeSchedules) {
      const spot = spotMap.get(sch.spotId);
      if (!spot) continue;

      const days = sch.daysOfWeek
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const isToday =
        days.includes(currentDay) ||
        days.includes('*') ||
        sch.daysOfWeek.toLowerCase().includes('todos');

      if (!isToday) continue;

      const [hh, mm] = sch.scheduledTime.split(':').map((n) => parseInt(n, 10));
      const schedMinutes = (hh || 0) * 60 + (mm || 0);
      const diffMinutes = Math.abs(currentMinutes - schedMinutes);

      // Quanto menor a diferença para o horário atual, maior a prioridade na fila
      const priorityScore = Math.max(10, 1000 - diffMinutes);

      queue.push({
        id: `sched-${sch.id}`,
        spotId: spot.id,
        title: spot.title,
        audioUrl: spot.audioUrl,
        durationSeconds: spot.durationSeconds,
        establishmentName: spot.establishmentName || null,
        establishmentWhatsapp: spot.establishmentWhatsapp || null,
        cityName: sch.cityName || 'Conquista',
        scheduledTime: sch.scheduledTime,
        isScheduledForToday: true,
        priorityScore,
      });

      includedSpotIds.add(spot.id);
    }

    // 4. Adicionar demais spots ativos em rotação geral
    for (const spot of activeSpots) {
      if (includedSpotIds.has(spot.id)) continue;

      queue.push({
        id: `rot-${spot.id}`,
        spotId: spot.id,
        title: spot.title,
        audioUrl: spot.audioUrl,
        durationSeconds: spot.durationSeconds,
        establishmentName: spot.establishmentName || null,
        establishmentWhatsapp: spot.establishmentWhatsapp || null,
        cityName: 'Conquista',
        scheduledTime: null,
        isScheduledForToday: false,
        priorityScore: 5,
      });
    }

    // Ordenar fila pela maior prioridade (horários agendados próximos ao horário atual primeiro)
    queue.sort((a, b) => b.priorityScore - a.priorityScore);

    return NextResponse.json({
      stationName: 'Rádio Digital PULSO • Conquista - MG',
      fallbackStreamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
      serverTime: now.toISOString(),
      currentTimeFormatted: `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`,
      totalSpotsInQueue: queue.length,
      queue,
    });
  } catch (err) {
    console.error('Erro ao montar fila de áudio da rádio:', err);
    return NextResponse.json(
      {
        stationName: 'Rádio Digital PULSO • Conquista - MG',
        fallbackStreamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
        totalSpotsInQueue: 0,
        queue: [],
      },
      { status: 200 }
    );
  }
}
