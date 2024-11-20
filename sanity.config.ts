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
// Schema types to be translated
const translatedSchemaTypes = ['lesson']

export default defineConfig(
  // Return a config object per-language
  supportedLanguages.map((language) => {
    return {
      name: language.title,
      title: language.title,
      basePath: `/${language.id}`,

      projectId: process.env.SANITY_STUDIO_PROJECT_ID,
      dataset: 'production',

      plugins: [
        structureTool({
          // Use structure to limit what language content shows per-workspace
          structure: (S) =>
            S.list()
              .title('Content')
              .items([
                // Create a list item per-translated schema type
                S.listItem()
                  .title(`Lessons`)
                  .child(
                    S.documentList()
                      .apiVersion('2024-06-01')
                      .title(`${language.title} lessons`)
                      .schemaType('lesson')
                      .filter('_type == "lesson" && language == $language')
                      .params({language: language.id}),
                  ),
              ]),
        }),
        visionTool(),
        documentInternationalization({
          supportedLanguages,
          schemaTypes: translatedSchemaTypes,
        }),
      ],

      schema: {
        types: schemaTypes,
        // Limit new document creation to current language
        templates: (prev) => {
          return prev.filter((template) => {
            if (translatedSchemaTypes.includes(template.schemaType)) {
              return template.value.language == language.id
            }
          })
        },
      },
    } as WorkspaceOptions
  }),
)
