import { computed, ref, watch } from 'vue';

import { removeAttr } from '../utils/format';

export function useMarkdown(props: { content: string; typing: boolean }) {
  const markdownHtml = ref('');
  const markdownContent = computed(() => {
    const content = props.content || '';
    return (
      content +
      (props.typing
        ? (content.match(/```/g)?.length || 0) % 2
          ? ' _'
          : ' <span class="typing">_</span>'
        : '')
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
    const langs = getLangs(markdownContent.value).filter(
      isShikiSupportLanguage,
    );
    if (langs?.length) {
      getHighlighter(langs).then((highlight) => renderMarkdown(highlight));
    } else {
      renderMarkdown();
    }
  };

  watch(() => markdownContent.value, load, { immediate: true });

  return {
    markdownHtml,
  };
}

function getLangs(text: string) {
  return (
    text.match(/```[a-z1-9-]+/g)?.map((item) => item.replace('```', '')) || []
  );
}

const shikiSupportLangs: string[] = window.shiki.BUNDLED_LANGUAGES.flatMap(
  (item) => (item.aliases || []).concat(item.id),
);

function isShikiSupportLanguage(language: string) {
  return shikiSupportLangs.includes(language);
}

let highlighter;
let highlighterPromise;
const langsCache: Record<string, Promise<any>> = {};

async function getHighlighter(langs: string[]): Promise<(str, lang) => string> {
  if (!highlighterPromise) {
    highlighterPromise = window.shiki.getHighlighter({
      theme: 'material-theme-palenight',
      langs: [],
    });
  }

  highlighter = highlighter || (await highlighterPromise);

  await Promise.all(
    langs.map(
      (item) =>
        (langsCache[item] = langsCache[item] || highlighter.loadLanguage(item)),
    ),
  );

  return highlighterWrapper;
}

function highlighterWrapper(str, lang) {
  try {
    return removeAttr(highlighter.codeToHtml(str, { lang }), 'pre', 'style');
  } catch (e) {
    return '';
  }
}
