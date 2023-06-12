import { computed, ref, watch } from 'vue';

import { removeAttr } from '../utils/format';

export function useMarkdown(props: { content: string; typing: boolean }) {
  const markdownHtml = ref('');
  const loading = ref(false);
  const markdownContent = computed(() => {
    return (
      (props.content || '') +
      (props.typing || loading.value ? '<span class="typing">_</span>' : '')
    );
  });

  const renderMarkdown = (highlight?) => {
    const md = window.markdownit({
      html: true,
      linkify: true,
      highlight,
    });

    markdownHtml.value = md.render(markdownContent.value);
  };

  const load = () => {
    const langs = getLangs(markdownContent.value);

    if (langs?.length) {
      loading.value = true;
      highlightCode(langs)
        .then(
          (highlight) => renderMarkdown(highlight),
          () => renderMarkdown(),
        )
        .finally(() => (loading.value = false));
    } else {
      renderMarkdown();
    }
  };

  watch(() => markdownContent.value, load, { immediate: true });

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
