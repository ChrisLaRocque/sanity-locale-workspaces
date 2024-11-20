import {defineConfig, WorkspaceOptions} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {documentInternationalization} from '@sanity/document-internationalization'

// Languages used by documentInternationalization
const supportedLanguages = [
  {id: 'es', title: 'Spanish'},
  {id: 'en', title: 'English'},
]
const translatedSchemaTypes = ['lesson']
export default defineConfig(
  // Return a config object per-language
  supportedLanguages.map((language) => {
    return {
      name: language.title,
      title: language.title,
      basePath: `/${language.id}`,

      projectId: '6cr3frbp',
      dataset: 'production',

      plugins: [
        structureTool(),
        visionTool(),
        documentInternationalization({
          supportedLanguages: [language],
          schemaTypes: translatedSchemaTypes,
        }),
      ],

      schema: {
        types: schemaTypes,
        // Filter out the default new document action
        templates: (prev) =>
          prev.filter((template) => !translatedSchemaTypes.includes(template.id)),
      },
    } as WorkspaceOptions
  }),
)
