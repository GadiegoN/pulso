'use server';

import { z } from 'zod';
import { requireStaff as requireAdmin, recordAuditLog } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { establishments, categories, cities, spots } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const establishmentSchema = z.object({
  name: z.string().min(2, 'O nome do estabelecimento é obrigatório.'),
  cityId: z.string().uuid('Selecione uma cidade válida.'),
  categoryId: z.string().uuid('Selecione uma categoria válida.'),
  whatsapp: z.string().min(10, 'Informe um WhatsApp com DDD válido.'),
  address: z.string().optional(),
  description: z.string().optional(),
  ownerId: z.string().uuid().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
});

const categorySchema = z.object({
  name: z.string().min(2, 'O nome da categoria é obrigatório.'),
  icon: z.string().optional(),
});

export type CommerceActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Criação de Estabelecimento Comercial Parceiro.
 */
export async function createEstablishmentAction(
  prevState: CommerceActionState,
  formData: FormData
): Promise<CommerceActionState> {
  const admin = await requireAdmin();

  const rawData = {
    name: formData.get('name')?.toString()?.trim() || '',
    cityId: formData.get('cityId')?.toString() || '',
    categoryId: formData.get('categoryId')?.toString() || '',
    whatsapp: formData.get('whatsapp')?.toString()?.trim() || '',
    address: formData.get('address')?.toString()?.trim() || '',
    description: formData.get('description')?.toString()?.trim() || '',
    ownerId: formData.get('ownerId')?.toString() || '',
    isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
  };

  const validation = establishmentSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Preencha os campos obrigatórios corretamente.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, cityId, categoryId, whatsapp, address, description, ownerId, isFeatured } =
    validation.data;
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .concat(`-${Math.floor(1000 + Math.random() * 9000)}`);

  const [newEst] = await db
    .insert(establishments)
    .values({
      name,
      slug,
      cityId,
      categoryId,
      whatsapp,
      address: address || null,
      description: description || null,
      ownerId: ownerId || null,
      isFeatured,
      isActive: true,
    })
    .returning();

  await recordAuditLog({
    actorId: admin.id,
    action: 'establishment_created',
    details: { establishmentId: newEst.id, name: newEst.name, cityId, isFeatured },
  });

  revalidatePath('/admin/comercios');
  revalidatePath('/admin/radio');
  revalidatePath('/guia');
  return { success: true };
}

/**
 * Alterna o selo "Parceiro Âncora / Destaque" do Estabelecimento no Guia Comercial.
 */
export async function toggleEstablishmentFeaturedAction(id: string, isFeatured: boolean) {
  const admin = await requireAdmin();

  await db
    .update(establishments)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(establishments.id, id));

  await recordAuditLog({
    actorId: admin.id,
    action: isFeatured ? 'establishment_featured_enabled' : 'establishment_featured_disabled',
    details: { establishmentId: id },
  });

  revalidatePath('/admin/comercios');
  revalidatePath('/guia');
}

/**
 * Alterna ativação de Estabelecimento.
 */
export async function toggleEstablishmentStatusAction(id: string, isActive: boolean) {
  const admin = await requireAdmin();

  await db
    .update(establishments)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(establishments.id, id));

  await recordAuditLog({
    actorId: admin.id,
    action: isActive ? 'establishment_activated' : 'establishment_deactivated',
    details: { establishmentId: id },
  });

  revalidatePath('/admin/comercios');
}

/**
 * Exclusão de Estabelecimento Comercial.
 */
export async function deleteEstablishmentAction(id: string) {
  const admin = await requireAdmin();

  // Desvincula spots associados para manter integridade
  await db
    .update(spots)
    .set({ establishmentId: null })
    .where(eq(spots.establishmentId, id));

  await db.delete(establishments).where(eq(establishments.id, id));

  await recordAuditLog({
    actorId: admin.id,
    action: 'establishment_deleted',
    details: { establishmentId: id },
  });

  revalidatePath('/admin/comercios');
  revalidatePath('/admin/radio');
}

/**
 * Criação de Categoria de Comércio.
 */
export async function createCategoryAction(
  prevState: CommerceActionState,
  formData: FormData
): Promise<CommerceActionState> {
  const admin = await requireAdmin();

  const name = formData.get('name')?.toString()?.trim() || '';
  const icon = formData.get('icon')?.toString()?.trim() || 'Store';

  const validation = categorySchema.safeParse({ name, icon });
  if (!validation.success) {
    return {
      error: 'Nome da categoria inválido.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-');

  await db
    .insert(categories)
    .values({
      name: validation.data.name,
      slug,
      icon: validation.data.icon,
    })
    .onConflictDoNothing();

  await recordAuditLog({
    actorId: admin.id,
    action: 'category_created',
    details: { name },
  });

  revalidatePath('/admin/comercios');
  return { success: true };
}

/**
 * Registra clique real no botão de WhatsApp de um estabelecimento no Guia Comercial (/guia).
 */
export async function recordWhatsappClickAction(establishmentId: string) {
  if (!establishmentId) return;

  await db
    .update(establishments)
    .set({
      whatsappClicks: sql`${establishments.whatsappClicks} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(establishments.id, establishmentId));
}

/**
 * Seed inicial automático de categorias essenciais se tabela estiver vazia.
 */
export async function seedDefaultCategories() {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
  if ((existing[0]?.count ?? 0) === 0) {
    const defaultCats = [
      { name: 'Alimentação & Restaurantes', slug: 'alimentacao', icon: 'Utensils' },
      { name: 'Saúde & Farmácias', slug: 'saude-farmacias', icon: 'HeartPulse' },
      { name: 'Supermercados & Mercearias', slug: 'supermercados', icon: 'ShoppingCart' },
      { name: 'Varejo & Moda', slug: 'varejo-moda', icon: 'Shirt' },
      { name: 'Construção & Reformas', slug: 'construcao', icon: 'Hammer' },
      { name: 'Agropecuária & Pet', slug: 'agropecuaria', icon: 'Wheat' },
      { name: 'Serviços Automotivos', slug: 'automotivo', icon: 'Car' },
      { name: 'Serviços Profissionais', slug: 'servicos', icon: 'Briefcase' },
    ];

    for (const c of defaultCats) {
      await db.insert(categories).values(c).onConflictDoNothing();
    }
  }
}
