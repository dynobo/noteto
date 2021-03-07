/**
 * @param {String} str representing a single element
 * @return {Element} DOM element
 */
function htmlToElement(str) {
  const template = document.createElement('template');
  const html = str.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

/**
   * @param {Array} elements Array of elements to remove from DOM
   */
function removeElements(elements) {
  elements.forEach((el) => {
    el.parentElement.removeChild(el);
  });
}

/**
   * @param {Element} el DOM element which childs should be removed
   */
function removeChildElements(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export {
  htmlToElement,
  removeChildElements,
  removeElements,
};
