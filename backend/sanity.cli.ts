import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  studioHost: 'nippy-osegbe',
  deployment: {
    appId: '11f1db14ad865773be9b44fb',
    autoUpdates: false,
  },
  api: {
    projectId: 'vuye8s8l',
    dataset: 'production',
  },
});
