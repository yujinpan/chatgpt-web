export function removeAttr(html: string, tag: string, attr: string) {
  return html.replace(
    new RegExp(`<${tag}[^>]*(\\s${attr}(="[^"]*")?)`),
    (match, p1) => match.replace(p1, ''),
  );
}

export function insertText(
  str: string,
  text: string,
  start: number,
  end: number = start,
) {
  return str.slice(0, start) + '\n' + str.slice(end);
}
