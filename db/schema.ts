import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  garment: text("garment").notNull(),
  content: text("content").notNull(),
  period: text("period").notNull().default(""),
  source: text("source").notNull(),
  institution: text("institution").notNull().default(""),
  sourceUrl: text("source_url").notNull(),
  copyright: text("copyright").notNull(),
  contributor: text("contributor").notNull(),
  notes: text("notes").notNull().default(""),
  imageKey: text("image_key"),
  status: text("status").notNull().default("pending"),
  reviewNote: text("review_note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// The first release keeps the remaining domain entities as curated seed content.
// These table names reserve the future platform model without inventing records.
export const garments = sqliteTable("garments", { id:text("id").primaryKey(), name:text("name").notNull(), status:text("status").notNull().default("draft") });
export const names = sqliteTable("names", { id:integer("id").primaryKey({autoIncrement:true}), garmentId:text("garment_id").notNull(), value:text("value").notNull() });
export const periods = sqliteTable("periods", { id:text("id").primaryKey(), label:text("label").notNull() });
export const texts = sqliteTable("texts", { id:text("id").primaryKey(), title:text("title").notNull(), sourceUrl:text("source_url") });
export const textMentions = sqliteTable("text_mentions", { id:integer("id").primaryKey({autoIncrement:true}), textId:text("text_id").notNull(), garmentId:text("garment_id").notNull(), quote:text("quote").notNull() });
export const evidence = sqliteTable("evidence", { id:integer("id").primaryKey({autoIncrement:true}), title:text("title").notNull(), type:text("type").notNull(), status:text("status").notNull().default("draft") });
export const evidenceLinks = sqliteTable("evidence_links", { id:integer("id").primaryKey({autoIncrement:true}), evidenceId:integer("evidence_id").notNull(), garmentId:text("garment_id").notNull() });
export const reviews = sqliteTable("reviews", { id:integer("id").primaryKey({autoIncrement:true}), submissionId:integer("submission_id").notNull(), status:text("status").notNull(), note:text("note").notNull().default("") });
export const contributors = sqliteTable("contributors", { id:integer("id").primaryKey({autoIncrement:true}), displayName:text("display_name").notNull() });
