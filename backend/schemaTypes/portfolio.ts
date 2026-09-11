import { defineField, defineType } from "sanity";
const requiredString = (name: string, title: string, max = 160) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (r) => r.required().max(max),
  });
const text = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "text",
    rows: 4,
    validation: (r) => r.max(4000),
  });
const order = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  initialValue: 10,
  validation: (r) => r.required().integer().min(0),
});
const image = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
});
const imageAlt = defineField({
  name: "imageAlt",
  title: "Image description",
  type: "string",
  description: "Describe meaningful visual content for screen readers.",
  validation: (r) =>
    r.custom((value, context) =>
      context.document?.image && !value ? "Add an image description." : true,
    ),
});
const tags = defineField({
  name: "tags",
  title: "Technologies",
  type: "array",
  of: [{ type: "string" }],
  options: { layout: "tags" },
  validation: (r) => r.max(10),
});
const url = defineField({
  name: "url",
  title: "Full case study on NIPPYSKY",
  type: "url",
  validation: (r) => r.required().uri({ scheme: ["https"] }),
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    requiredString("name", "Full name"),
    requiredString("shortName", "Short name"),
    requiredString("email", "Contact email"),
    requiredString("location", "Location"),
    ...["github", "linkedin", "company"].map((name) =>
      defineField({
        name,
        title: name[0].toUpperCase() + name.slice(1),
        type: "url",
        validation: (r) => r.uri({ scheme: ["https"] }),
      }),
    ),
    defineField({
      name: "cv",
      title: "Current CV",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "cvUrl",
      title: "CV fallback URL",
      type: "string",
      description: "Use /cv/chukwudubem-osegbe-cv.pdf for the included CV.",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site settings",
      subtitle: "Contact, links and CV",
    }),
  },
});
export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    requiredString("eyebrow", "Professional identity"),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(200),
      description:
        "One line per sentence. The third line receives the accent colour.",
    }),
    text("intro", "Introduction"),
    text("currentFocus", "Current AI / ML focus"),
    requiredString("availability", "Roles and opportunities", 250),
    text("bio", "Biography"),
  ],
  preview: {
    prepare: () => ({
      title: "Personal profile",
      subtitle: "Software, systems, founder story and AI / ML",
    }),
  },
});
export const selectedWork = defineType({
  name: "selectedWork",
  title: "Selected work",
  type: "document",
  fields: [
    requiredString("title", "Project name"),
    defineField({
      name: "slug",
      title: "Stable identifier",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    requiredString("category", "Category"),
    requiredString("year", "Project year"),
    requiredString("role", "Your role"),
    requiredString("summary", "Short introduction", 250),
    text("contribution", "Your contribution"),
    text("decision", "An engineering decision"),
    tags,
    url,
    image,
    imageAlt,
    defineField({
      name: "imageUrl",
      title: "Bundled image fallback",
      type: "string",
      description:
        "For existing /work/ files or cdn.sanity.io images. Upload new images using the Image field above.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/work/") && !value.includes("..")) return true;
          try {
            const url = new URL(value);
            if (url.protocol === "https:" && url.hostname === "cdn.sanity.io")
              return true;
          } catch {}
          return "Use a /work/ path or a Sanity image URL, or upload an image above.";
        }),
    }),
    defineField({
      name: "style",
      title: "Media presentation",
      type: "string",
      options: {
        list: ["aku", "ugwo", "citizen", "marobi", "decentroneum", "yunite"],
      },
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      title: "Archive from portfolio",
      type: "boolean",
      initialValue: false,
    }),
    order,
  ],
  preview: { select: { title: "title", subtitle: "role", media: "image" } },
});
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    requiredString("company", "Organisation"),
    requiredString("role", "Role"),
    requiredString("period", "Employment period"),
    text("summary", "Contribution"),
    order,
  ],
  preview: { select: { title: "company", subtitle: "role" } },
});
export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    requiredString("institution", "Institution"),
    requiredString("qualification", "Qualification"),
    requiredString("period", "Dates and status"),
    requiredString("detail", "Location and details"),
    order,
  ],
  preview: { select: { title: "institution", subtitle: "qualification" } },
});
export const githubLabSource = defineType({
  name: "githubLabSource",
  title: "GitHub lab source",
  type: "document",
  readOnly: true,
  fields: [
    requiredString("sourceId", "Stable source ID"),
    defineField({
      name: "repoId",
      title: "GitHub repository ID",
      type: "number",
    }),
    requiredString("itemId", "Lab item ID"),
    requiredString("repoName", "Repository"),
    requiredString("title", "GitHub title"),
    text("summary", "GitHub summary"),
    defineField({ name: "image", title: "Automatic cover", type: "image" }),
    defineField({
      name: "imageAlt",
      title: "Automatic cover description",
      type: "string",
    }),
    defineField({
      name: "imageOrigin",
      title: "Cover origin",
      type: "string",
      options: { list: ["repository", "generated"] },
    }),
    defineField({ name: "imageKey", title: "Cover sync key", type: "string" }),
    defineField({
      name: "githubCoverPath",
      title: "GitHub cover path",
      type: "string",
    }),
    defineField({ name: "url", title: "Code URL", type: "url" }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "language", title: "Language", type: "string" }),
    defineField({ name: "kind", title: "Kind", type: "string" }),
    defineField({
      name: "updatedAt",
      title: "Repository updated",
      type: "datetime",
    }),
    defineField({
      name: "lastVerifiedAt",
      title: "Last verified public",
      type: "datetime",
    }),
    defineField({ name: "hash", title: "Sync hash", type: "string" }),
  ],
  preview: { select: { title: "title", subtitle: "repoName" } },
});
export const labEditorial = defineType({
  name: "labEditorial",
  title: "AI & Automation lab presentation",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "GitHub lab",
      type: "reference",
      to: [{ type: "githubLabSource" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title override",
      type: "string",
      validation: (r) => r.max(160),
    }),
    text("summary", "Summary override"),
    text("learningNotes", "What I learned"),
    {
      ...image,
      title: "Cover override",
      description:
        "Optional. GitHub imports supply a cover automatically; uploading here replaces it.",
    },
    imageAlt,
    defineField({
      name: "kind",
      title: "Type of work",
      type: "string",
      options: { list: ["Coursework", "Experiment", "Project", "Prototype"] },
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      title: "Hide from portfolio",
      type: "boolean",
      initialValue: false,
    }),
    order,
  ],
  preview: {
    select: {
      title: "title",
      sourceTitle: "source.title",
      subtitle: "kind",
      media: "image",
    },
    prepare: ({ title, sourceTitle, ...rest }) => ({
      title: title || sourceTitle || "Lab presentation",
      ...rest,
    }),
  },
});
export const labSyncStatus = defineType({
  name: "labSyncStatus",
  title: "Lab sync status",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "lastSuccess",
      type: "datetime",
      title: "Last successful sync",
    }),
    defineField({ name: "count", type: "number", title: "Imported labs" }),
  ],
});
export const portfolioTypes = [
  siteSettings,
  profile,
  selectedWork,
  experience,
  education,
  githubLabSource,
  labEditorial,
  labSyncStatus,
];
