import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// --- ENUMS ---
export const userRoleEnum = pgEnum('user_role', ['admin', 'operator', 'merchant', 'user']);
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'pending_verification']);
export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted', 'revoked', 'expired']);
export const broadcastCategoryEnum = pgEnum('broadcast_category', [
  'public_utility',
  'civic_alert',
  'partner_offer',
  'local_news',
]);
export const spotRequestStatusEnum = pgEnum('spot_request_status', [
  'pending',
  'approved',
  'produced',
  'rejected',
]);
export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'converted',
  'archived',
]);

// --- PROFILES (Vinculado estritamente ao auth.users do Supabase) ---
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // ID idêntico ao auth.users.id
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('pending_verification').notNull(),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- INVITATIONS (Convites controlados para membros administrativos e comerciantes) ---
export const invitations = pgTable('invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: userRoleEnum('role').notNull(), // admin, operator ou merchant
  invitedBy: uuid('invited_by').references(() => profiles.id).notNull(),
  tokenHash: text('token_hash').notNull().unique(),
  status: inviteStatusEnum('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- AUDIT LOGS (Trilha de auditoria perene e imutável para ações sensíveis) ---
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => profiles.id), // Nullable para eventos de sistema
  action: text('action').notNull(), // ex: 'role_promoted', 'account_suspended', 'invite_sent', 'login_success'
  targetUserId: uuid('target_user_id'),
  details: jsonb('details'), // Dados complementares estruturados
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- SECURITY EVENTS (Monitoramento de segurança, rate limiting e proteção contra abusos) ---
export const securityEvents = pgTable('security_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email'),
  ipAddress: text('ip_address').notNull(),
  eventType: text('event_type').notNull(), // 'failed_login', 'rate_limit_exceeded', 'password_reset_attempt'
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEGÓCIO: CIDADES & COMÉRCIO ---
export const cities = pgTable('cities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  state: text('state').notNull(), // MG, SP, etc.
  slug: text('slug').notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const establishments = pgTable('establishments', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  ownerId: uuid('owner_id').references(() => profiles.id), // Opcional: dono comerciante
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  whatsapp: text('whatsapp'),
  address: text('address'),
  whatsappClicks: integer('whatsapp_clicks').default(0).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEGÓCIO: RÁDIO DIGITAL & SPOTS ---
export const spots = pgTable('spots', {
  id: uuid('id').defaultRandom().primaryKey(),
  establishmentId: uuid('establishment_id').references(() => establishments.id),
  title: text('title').notNull(),
  audioUrl: text('audio_url').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const radioSchedules = pgTable('radio_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  spotId: uuid('spot_id').references(() => spots.id).notNull(),
  scheduledTime: text('scheduled_time').notNull(), // 'HH:mm'
  daysOfWeek: text('days_of_week').notNull(), // '1,2,3,4,5'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const spotRequests = pgTable('spot_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  establishmentId: uuid('establishment_id').references(() => establishments.id).notNull(),
  merchantId: uuid('merchant_id').references(() => profiles.id).notNull(),
  title: text('title').notNull(),
  scriptNotes: text('script_notes').notNull(),
  preferredTimeSlot: text('preferred_time_slot'),
  status: spotRequestStatusEnum('status').default('pending').notNull(),
  adminFeedback: text('admin_feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- NEGÓCIO: CENTRAL WHATSAPP & COMUNICADOS COMUNITÁRIOS ---
export const whatsappChannels = pgTable('whatsapp_channels', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  name: text('name').notNull(),
  neighborhoodOrScope: text('neighborhood_or_scope').notNull(),
  inviteLink: text('invite_link'),
  memberCount: integer('member_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const whatsappBroadcasts = pgTable('whatsapp_broadcasts', {
  id: uuid('id').defaultRandom().primaryKey(),
  cityId: uuid('city_id').references(() => cities.id).notNull(),
  channelId: uuid('channel_id').references(() => whatsappChannels.id),
  establishmentId: uuid('establishment_id').references(() => establishments.id),
  authorId: uuid('author_id').references(() => profiles.id).notNull(),
  category: broadcastCategoryEnum('category').default('public_utility').notNull(),
  title: text('title').notNull(),
  messageBody: text('message_body').notNull(),
  formattedMessage: text('formatted_message').notNull(),
  ctaUrl: text('cta_url'),
  dispatchedAt: timestamp('dispatched_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- LEADS & CONTATOS ---
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  whatsapp: text('whatsapp').notNull(),
  email: text('email'),
  interest: text('interest').notNull(),
  status: leadStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
