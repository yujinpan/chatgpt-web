import { onMounted, ref } from 'vue';

import { removeAttr } from '../utils/format';

export function useMarkdown(props: { content: string }) {
  const markdownHtml = ref('');
  const loading = ref(false);

  const renderMarkdown = (highlight?) => {
    const md = window.markdownit({
      html: true,
      linkify: true,
      highlight,
    });

    markdownHtml.value = md.render(props.content);
  };

  onMounted(() => {
    const langs = getLangs(props.content);

    loading.value = true;
    if (langs?.length) {
      highlightCode(langs)
        .then(
          (highlight) => renderMarkdown(highlight),
          () => renderMarkdown(),
        )
        .finally(() => (loading.value = false));
    } else {
      renderMarkdown();
      loading.value = false;
    }
  });

  return {
    markdownHtml,
    loading,
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
