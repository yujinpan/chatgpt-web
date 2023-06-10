export function setInputPosition(
  input: HTMLInputElement | HTMLTextAreaElement,
  index: number,
) {
  input.selectionStart = input.selectionEnd = index;
}

let requestAnimationFrameNumber;

export function scrollToBottom(bottomHeight: number, immediate = false) {
  if (requestAnimationFrameNumber) {
    cancelAnimationFrame(requestAnimationFrameNumber);
    requestAnimationFrameNumber = null;
  }

  const scrollTop =
    document.body.clientHeight -
    (document.documentElement.clientHeight - bottomHeight);

  if (immediate) {
    document.scrollingElement.scrollTop = scrollTop;
    return;
  }

  let currentScrollTop = document.scrollingElement.scrollTop;
  const interval = (scrollTop - currentScrollTop) / 30;
  const scroll = () => {
    if (currentScrollTop >= scrollTop) return;

    currentScrollTop += interval;
    document.scrollingElement.scrollTop = currentScrollTop;
    requestAnimationFrameNumber = requestAnimationFrame(scroll);
  };
  requestAnimationFrameNumber = requestAnimationFrame(scroll);
}
