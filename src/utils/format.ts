export function removeAttr(html: string, tag: string, attr: string) {
  return html.replace(
    new RegExp(`<${tag}[^>]*(\\s${attr}(="[^"]*")?)`),
    (match, p1) => match.replace(p1, ''),
  );
}
