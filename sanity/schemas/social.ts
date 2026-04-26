import { defineField, defineType } from "sanity";

export default defineType({
  name: "social",
  title: "Social link",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", description: "Short label (Email / GitHub …)" }),
    defineField({
      name: "platform",
      type: "string",
      options: {
        list: ["github", "linkedin", "email", "leetcode", "custom"].map((v) => ({
          title: v,
          value: v,
        })),
      },
      initialValue: "custom",
    }),
    defineField({ name: "handle", type: "string", description: "Display string, e.g. @alanansari" }),
    defineField({
      name: "url",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "label", subtitle: "handle" } },
});
