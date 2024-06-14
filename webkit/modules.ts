export async function loadModules() {
  const css = [
    'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css',
  ];
  const js = [
    'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js',
    'https://unpkg.com/shiki@0.14.7/dist/index.unpkg.iife.js',
  ];

  await Promise.all(
    css
      .map((item) => {
        return new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.onload = resolve;
          link.onerror = reject;
          link.rel = 'stylesheet';
          link.href = item;
          document.head.appendChild(link);
        });
      })
      .concat(
        js.map((item) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = resolve;
            script.onerror = reject;
            script.src = item;
            document.body.appendChild(script);
          });
        }),
      ),
  );
}
