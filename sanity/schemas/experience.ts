import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "companyUrl", type: "url" }),
    defineField({ name: "locationLine", type: "string", description: 'e.g. "Chicago, IL · Remote"' }),
    defineField({ name: "period", type: "string", description: 'e.g. "Mar 2025 — Present"' }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({
      name: "points",
      type: "array",
      of: [{ type: "text", rows: 2 }],
    }),
    defineField({
      name: "stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: { title: "role", subtitle: "company" },
  },
});
