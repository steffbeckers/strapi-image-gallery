import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import ImageGalleryCustomField from './components/ImageGalleryCustomField';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.customFields.register({
      name: 'image-gallery',
      plugin: PLUGIN_ID,
      type: 'json', // use JSON type to store an array of images
      intlLabel: {
        id: 'image-gallery.label',
        defaultMessage: 'Image Gallery',
      },
      intlDescription: {
        id: 'image-gallery.description',
        defaultMessage: 'Upload and arrange multiple images using drag and drop',
      },
      icon: 'images', // you can use any icon here
      components: {
        Input: async () => ImageGalleryCustomField,
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
