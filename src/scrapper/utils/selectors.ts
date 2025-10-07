export type SelectorResult = {
  text: string;
  url: string;
  image: string;
  value: string;
};

export const selector = (el: Element, selector: string): SelectorResult => {
  const node = el.querySelector(selector);
  if (!node) return { text: '', url: '', image: '', value: '' };

  const result: SelectorResult = {
    text: node.textContent?.trim() || '',
    url: node.getAttribute('href') || '',
    image: node.getAttribute('src') || '',
    value: node.getAttribute('value') || '',
  };

  if (node instanceof HTMLAnchorElement) result.url = node.href;
  if (node instanceof HTMLOptionElement) result.value = node.value;
  if (node instanceof HTMLImageElement)
    result.image = node.src || node.getAttribute('data-src') || '';

  return result;
};

export const selectorAll = (
  el: Element,
  selector: string,
): SelectorResult[] => {
  return Array.from(el.querySelectorAll(selector)).map((node) => {
    const result: SelectorResult = {
      text: node.textContent?.trim() || '',
      url: node.getAttribute('href') || '',
      image: node.getAttribute('src') || '',
      value: node.getAttribute('value') || '',
    };

    if (node instanceof HTMLAnchorElement) result.url = node.href;
    if (node instanceof HTMLOptionElement) result.value = node.value;
    if (node instanceof HTMLImageElement)
      result.image = node.src || node.getAttribute('data-src') || '';

    return result;
  });
};
