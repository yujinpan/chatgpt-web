import type { PluginOption } from 'vite';

const vitePluginGA = (): PluginOption => ({
  name: 'ga',
  enforce: 'post',
  apply: 'build',
  transformIndexHtml: () => {
    return [
      {
        tag: 'script',
        attrs: {
          async: '',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-S66MPLRFJZ',
        },
        injectTo: 'body',
      },
      {
        tag: 'script',
        injectTo: 'body',
        children: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-S66MPLRFJZ');
`,
      },
    ];
  },
});

export default vitePluginGA;
