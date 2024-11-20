import {defineField, defineType} from 'sanity'

export const lessonType = defineType({
  name: 'lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
    }),
  ],
})
