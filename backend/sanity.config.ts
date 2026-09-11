import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
const singletons = new Set(['siteSettings', 'profile', 'labSyncStatus']);
const automatedTypes = new Set(['githubLabSource', 'labSyncStatus']);
export default defineConfig({
  name: 'default',
  title: 'Osegbe · Personal portfolio',
  projectId: 'vuye8s8l',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Portfolio')
          .items([
            S.listItem()
              .title('Profile & AI / ML focus')
              .child(S.document().schemaType('profile').documentId('profile')),
            S.listItem()
              .title('Site settings & CV')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.divider(),
            ...['selectedWork', 'experience', 'education', 'labEditorial'].map(
              (type) => S.documentTypeListItem(type),
            ),
            S.listItem()
              .title('GitHub sources & sync')
              .child(
                S.list()
                  .title('GitHub integration')
                  .items([
                    S.documentTypeListItem('githubLabSource'),
                    S.listItem()
                      .title('Sync status')
                      .child(
                        S.document()
                          .schemaType('labSyncStatus')
                          .documentId('labSyncStatus'),
                      ),
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (template) =>
          !singletons.has(template.schemaType) &&
          !automatedTypes.has(template.schemaType),
      ),
  },
  document: {
    actions: (actions, context) =>
      automatedTypes.has(context.schemaType)
        ? []
        : singletons.has(context.schemaType)
          ? actions.filter(
              (action) =>
                !['delete', 'duplicate'].includes(action.action || ''),
            )
          : actions,
  },
});
