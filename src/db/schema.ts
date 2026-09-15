import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export const genderEnum = pgEnum('gender', ['male', 'female', 'not set'])

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),

  phone: varchar('phone', { length: 20 }),
  gender: genderEnum('gender').default('not set').notNull(),
  address: text('address'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  wishlistItems: many(wishlistItems),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

// Cart Schema

export const carts = pgTable('carts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),

  cartId: text('cart_id')
    .notNull()
    .references(() => carts.id, {
      onDelete: 'cascade',
    }),

  productId: varchar('productId', { length: 255 }).notNull(),

  name: varchar('name', { length: 255 }).notNull(),

  price: integer('price').notNull(),

  color: varchar('color', { length: 100 }),

  size: varchar('size', { length: 20 }),

  quantity: integer('quantity').notNull(),

  image: jsonb('image').$type<{
    src: string
    alt?: string
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const cartsRelations = relations(carts, ({ many }) => ({
  lines: many(cartItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}))

// Whishlist Schema

export const wishlistItems = pgTable(
  'wishlist_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    productId: varchar('product_id', {
      length: 255,
    }).notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userProductUnique: uniqueIndex('wishlist_user_product_idx').on(table.userId, table.productId),
  })
)

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(user, {
    fields: [wishlistItems.userId],
    references: [user.id],
  }),
}))

// Single Product Page Orders Schema
export const sppOrders = pgTable(
  'spp_orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => nanoid()),
    orderNumber: serial('order_number').notNull().unique(),
    productId: varchar('product_id', {
      length: 255,
    }).notNull(),

    fullName: varchar('full_name', {
      length: 255,
    }).notNull(),

    address: text('address').notNull(),

    phone: varchar('phone', {
      length: 20,
    }).notNull(),

    productName: varchar('product_name', {
      length: 255,
    }).notNull(),

    productOption: varchar('product_option', {
      length: 255,
    }),

    productPrice: integer('product_price').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    productIdIndex: index('spp_orders_product_id_idx').on(table.productId),
    phoneIndex: index('spp_orders_phone_idx').on(table.phone),
    createdAtIndex: index('spp_orders_created_at_idx').on(table.createdAt),
  })
)
