import {defineField, defineType} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'heroDesc',
      title: 'Hero Description',
      type: 'text',
    }),
    defineField({
      name: 'cv',
      title: 'CV Link',
      type: 'url',
    }),
  ],
})
