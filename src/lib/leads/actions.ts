'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { recordSecurityEvent } from '@/lib/auth/server';

const leadSchema = z.object({
  nome: z.string().min(2, 'Por favor, informe seu nome completo.'),
  empresa: z.string().min(2, 'Informe o nome do seu comércio, negócio ou órgão público.'),
  segmento: z.string().min(1, 'Selecione o segmento.'),
  cidade: z.string().min(2, 'Informe a sua cidade.'),
  estado: z.string().min(2, 'Informe o estado (UF).'),
  whatsapp: z.string().min(10, 'Informe um número de WhatsApp com DDD válido.'),
  email: z.string().email('E-mail em formato inválido.').optional().or(z.literal('')),
  mensagem: z.string().optional(),
  concordaTermos: z.boolean().refine((val) => val === true, {
    message: 'É necessário concordar com os termos de privacidade para continuar.',
  }),
});

export type LeadActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Ação de Servidor para Recepção e Persistência de Leads Institucionais.
 * Grava o lead diretamente no PostgreSQL na tabela `leads`.
 */
export async function submitLeadAction(
  prevState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const rawData = {
    nome: formData.get('nome')?.toString()?.trim() || '',
    empresa: formData.get('empresa')?.toString()?.trim() || '',
    segmento: formData.get('segmento')?.toString()?.trim() || 'comercio',
    cidade: formData.get('cidade')?.toString()?.trim() || '',
    estado: formData.get('estado')?.toString()?.trim()?.toUpperCase() || 'MG',
    whatsapp: formData.get('whatsapp')?.toString()?.trim() || '',
    email: formData.get('email')?.toString()?.trim()?.toLowerCase() || '',
    mensagem: formData.get('mensagem')?.toString()?.trim() || '',
    concordaTermos: formData.get('concordaTermos') === 'true' || formData.get('concordaTermos') === 'on',
  };

  const validation = leadSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: 'Verifique os campos informados.',
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { nome, empresa, segmento, cidade, estado, whatsapp, email, mensagem } = validation.data;

  try {
    const formattedCity = `${cidade} - ${estado}`;
    const formattedInterest = `[${segmento.toUpperCase()}] Empresa/Negócio: ${empresa}${
      mensagem ? ` | Mensagem: ${mensagem}` : ''
    }`;

    // Inserção real no PostgreSQL
    await db.insert(leads).values({
      name: nome,
      city: formattedCity,
      whatsapp,
      email: email || null,
      interest: formattedInterest,
    });

    await recordSecurityEvent({
      email: email || undefined,
      eventType: 'lead_captured_landing_page',
      metadata: { cidade: formattedCity, whatsapp, empresa },
    });

    return {
      success: true,
    };
  } catch (err: any) {
    console.error('Erro ao salvar lead no PostgreSQL:', err);
    return {
      error: 'Não foi possível registrar o interesse no momento. Tente novamente mais tarde.',
    };
  }
}
