import React from 'react';
import { db } from '@/lib/db';
import { connection } from 'next/server';

export const instant = false;
import { profiles, invitations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/server';
import TeamClientView from './TeamClientView';

export default async function TeamPage() {
  await connection();
  const currentAdmin = await requireAdmin();

  // Buscar todos os perfis registrados
  const allProfiles = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.createdAt));

  // Buscar convites registrados
  const allInvitations = await db
    .select()
    .from(invitations)
    .orderBy(desc(invitations.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Gestão de Equipe & Convites
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gerencie permissões de acesso, revogue privilégios e expeça convites para novos membros
        </p>
      </div>

      <TeamClientView
        currentAdminId={currentAdmin.id}
        profiles={allProfiles}
        invitations={allInvitations}
      />
    </div>
  );
}
