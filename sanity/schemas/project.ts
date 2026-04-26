import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "role", type: "string", description: 'e.g. "Side project" or "Work · SDE"' }),
    defineField({ name: "year", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "viz",
      title: "Visualization",
      type: "string",
      description: "Which illustration to render in the card header",
      options: {
        list: [
          { title: "Buzrr (bars)", value: "buzrr" },
          { title: "Benefi (chart)", value: "benefi" },
          { title: "jsGamez (grid)", value: "jsgamez" },
          { title: "Samriddhi (heart)", value: "samriddhi" },
          { title: "Image (use uploaded)", value: "image" },
        ],
        layout: "radio",
      },
      initialValue: "buzrr",
    }),
    defineField({ name: "projectUrl", type: "url" }),
    defineField({
      name: "tech",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "role" },
  },
});
