import React from 'react';
import { requireAdmin } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { establishments, cities, categories, profiles, spots } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { connection } from 'next/server';
import { seedDefaultCategories } from '@/lib/commerce/actions';
import CommerceManagerView from './CommerceManagerView';

export const instant = false;

export default async function AdminComerciosPage() {
  await connection();
  await requireAdmin();

  // Garante categorias essenciais prontas
  await seedDefaultCategories();

  // Se nenhuma cidade estiver cadastrada, inicializa com a cidade de lançamento oficial
  const existingCities = await db.select({ count: sql<number>`count(*)::int` }).from(cities);
  if ((existingCities[0]?.count ?? 0) === 0) {
    await db.insert(cities).values({
      name: 'Conquista',
      state: 'MG',
      slug: 'conquista-mg',
      isActive: true,
    }).onConflictDoNothing();
  }

  // Buscar todos os estabelecimentos com relacionamentos
  const allEstablishments = await db
    .select({
      id: establishments.id,
      name: establishments.name,
      slug: establishments.slug,
      whatsapp: establishments.whatsapp,
      address: establishments.address,
      description: establishments.description,
      isActive: establishments.isActive,
      cityId: establishments.cityId,
      cityName: cities.name,
      cityState: cities.state,
      categoryId: establishments.categoryId,
      categoryName: categories.name,
      ownerId: establishments.ownerId,
      ownerEmail: profiles.email,
      ownerName: profiles.fullName,
      createdAt: establishments.createdAt,
    })
    .from(establishments)
    .leftJoin(cities, eq(establishments.cityId, cities.id))
    .leftJoin(categories, eq(establishments.categoryId, categories.id))
    .leftJoin(profiles, eq(establishments.ownerId, profiles.id))
    .orderBy(desc(establishments.createdAt));

  // Buscar todas as categorias
  const allCategories = await db.select().from(categories).orderBy(categories.name);

  // Buscar todas as cidades ativas
  const allCities = await db.select().from(cities).where(eq(cities.isActive, true)).orderBy(cities.name);

  // Buscar todos os comerciantes registrados
  const merchantProfiles = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      fullName: profiles.fullName,
    })
    .from(profiles)
    .where(eq(profiles.role, 'merchant'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Gestão de Comércios & Parceiros Locais
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Diretório comercial dos estabelecimentos parceiros atendidos pela rede de comunicação PULSO
        </p>
      </div>

      <CommerceManagerView
        establishments={allEstablishments}
        categories={allCategories}
        cities={allCities}
        merchants={merchantProfiles}
      />
    </div>
  );
}
