import type { PluginOption } from 'vite';

const vitePluginInlineCss = (options: {
  cssFilename: string;
  jsFilename: string;
}): PluginOption => ({
  name: 'inline-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const { [options.cssFilename]: style, [options.jsFilename]: js } = bundle;
    if (style) {
      js.code =
        `(function(){
  var style = document.createElement('style');
  style.innerText = ${JSON.stringify(style.source)};
  document.head.appendChild(style);
})();\n` + js.code;
    }
    delete bundle[options.cssFilename];
  },
  transformIndexHtml(html) {
    return html.replace(
      '<link rel="stylesheet" crossorigin href="https://yujinpan.github.io/chatgpt-web/webkit.css">\n    ',
      '',
    );
  },
});

export default vitePluginInlineCss;
