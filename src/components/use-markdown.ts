import { onMounted, ref } from 'vue';

import { removeAttr } from '../utils/format';

export function useMarkdown(props: { msg: string }) {
  const content = ref('');

  const renderMarkdown = (highlight?) => {
    const md = window.markdownit({
      html: true,
      linkify: true,
      highlight,
    });

    content.value = md.render(props.msg);
  };

  onMounted(() => {
    const langs = getLangs(props.msg);

    if (langs?.length) {
      highlightCode(langs).then(
        (highlight) => renderMarkdown(highlight),
        () => renderMarkdown(),
      );
    } else {
      renderMarkdown();
    }
  });

  return {
    content,
  };
}

function getLangs(text: string) {
  return text.match(/```[\w-]+/g)?.map((item) => item.replace('```', ''));
}

function highlightCode(langs: string[]): Promise<(str, lang) => string> {
  return window.shiki
    .getHighlighter({
      theme: 'material-theme-palenight',
      langs,
    })
    .then((highlighter) => (str, lang) => {
      return removeAttr(highlighter.codeToHtml(str, { lang }), 'pre', 'style');
    });
}
