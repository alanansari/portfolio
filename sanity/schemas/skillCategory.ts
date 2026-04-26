import { defineField, defineType } from "sanity";

export default defineType({
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({
      name: "skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: { select: { title: "title" } },
});
