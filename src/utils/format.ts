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

export function formatDate(
  value: number,
  format = 'yyyy-MM-dd HH:mm',
  sameYearFormat = 'MM-dd HH:mm',
) {
  const d = new Date(value);
  const year = d.getFullYear();
  const date = d.getDate();
  const month = d.getMonth() + 1;
  const hours = d.getHours();
  const minutes = d.getMinutes();

  const replaces = {
    yyyy: String(year),
    MM: String(fillZero(month)),
    dd: String(fillZero(date)),
    HH: String(fillZero(hours)),
    mm: String(fillZero(minutes)),
  };

  format = year === new Date().getFullYear() ? sameYearFormat : format;

  return Object.entries(replaces).reduce(
    (previousValue, [a, b]) => previousValue.replace(a, b),
    format,
  );
}

export function fillZero(num: number | string) {
  return String(num).length < 2 ? `0${num}` : num;
}
