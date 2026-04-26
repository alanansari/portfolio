import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "initial",
      type: "string",
      description: "Monogram shown in the sidebar (single letter)",
      validation: (r) => r.required().max(2),
    }),
    defineField({ name: "location", type: "string", initialValue: "NOIDA · IN" }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "availability", type: "string", initialValue: "Open to new work · Remote" }),
    defineField({ name: "statusNote", type: "string" }),

    defineField({ name: "kicker", type: "string", description: "Small pill above the hero headline" }),
    defineField({
      name: "headline",
      type: "string",
      description: "First/last name shown large in hero (e.g. 'Alan Ansari')",
    }),
    defineField({
      name: "headlineAccent",
      type: "string",
      description: "Accent trailing character (e.g. '.')",
    }),
    defineField({ name: "tagline", type: "text", rows: 3 }),
    defineField({ name: "aboutLede", type: "text", rows: 5 }),
    defineField({
      name: "aboutFacts",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", type: "string" }),
            defineField({ name: "value", type: "string" }),
            defineField({ name: "accent", type: "string", description: "Trailing accent snippet" }),
          ],
        },
      ],
    }),
    defineField({ name: "currentlyBuilding", type: "text", rows: 3 }),
    defineField({ name: "resumeUrl", type: "url" }),
  ],
});
