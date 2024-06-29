import {defineField, defineType} from 'sanity'

export const testimonyType = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
    }),
    defineField({
      name: 'testimony',
      title: 'Testimony',
      type: 'text',
    }),
  ],
})
