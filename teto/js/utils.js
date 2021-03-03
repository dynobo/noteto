/**
 * Calculate greatest common divisor of two numbers
 * @param {int} a first number
 * @param {int} b second number
 * @return {int} GCD
 */
function gcd(a, b) {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
}

/**
   * Calculate dimensions used for the SnapGrid.
   * @param {*} root
   * @return {dict} SnapGrid consisting of width (x), height (y) and offset
   */
function calcGrid(root) {
  // Get GCD for calculating grid size.
  const page = {
    width: root.viewBox.baseVal.width,
    height: root.viewBox.baseVal.height,
  };
  const pageGcd = gcd(page.height, page.width);

  // Bounding Rect
  const rect = root.getBoundingClientRect();

  // Define grid dimensions using GCD to ensures a quadratic grid which fills
  // the whole page. Add offset of element.
  return {
    x: pageGcd / 5,
    y: pageGcd / 5,
    offset: { x: rect.left, y: rect.top },
  };
}

function downloadSvgAsPng() {
  const svg = document.getElementById('paper-svg');
  const img = new Image();
  img.onload = function onImgLoad() {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctxt = canvas.getContext('2d');
    ctxt.fillStyle = '#fff';
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    ctxt.drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'template.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const svgClone = svg.cloneNode(true);
  svgClone.setAttribute('width', svgClone.viewBox.baseVal.width);
  svgClone.setAttribute('height', svgClone.viewBox.baseVal.height);
  const svgText = (new XMLSerializer()).serializeToString(svgClone);
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
}

/**
 * @param {String} str representing a single element
 * @return {Element}
 */
function htmlToElement(str) {
  const template = document.createElement('template');
  const html = str.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function removeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export {
  calcGrid, downloadSvgAsPng, htmlToElement, removeChildren,
};
