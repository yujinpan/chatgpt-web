export function setInputPosition(
  input: HTMLInputElement | HTMLTextAreaElement,
  index: number,
) {
  input.selectionStart = input.selectionEnd = index;
}
