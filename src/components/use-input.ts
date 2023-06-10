import { nextTick, ref } from 'vue';

import { setInputPosition } from '../utils/dom';
import { insertText } from '../utils/format';

export function useInput(
  props: { disabled?: boolean },
  emit: {
    submit: (text: string) => any;
  },
) {
  const isComposition = ref(false);
  const handleCompositionStart = () => (isComposition.value = true);
  const handleCompositionEnd = () => (isComposition.value = false);

  const inputElm = ref<HTMLTextAreaElement>();
  const input = ref('');

  const enter = (e: KeyboardEvent) => {
    if (props.disabled || isComposition.value) return;

    if (isNewLineEnter(e)) {
      const { selectionStart, selectionEnd } = inputElm.value;

      input.value = insertText(input.value, '\n', selectionStart, selectionEnd);
      nextTick(() => {
        setInputPosition(inputElm.value, selectionStart + 1);
      });
    } else if (input.value.trim()) {
      emit.submit(input.value);
      input.value = '';
    }
  };

  return {
    input,
    inputElm,
    enter,
    handleCompositionStart,
    handleCompositionEnd,
  };
}

function isNewLineEnter(e: KeyboardEvent) {
  return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
}
