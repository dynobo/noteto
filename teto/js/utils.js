import { globalOptionsConfig } from './config.js';
import Options from './blocks/Options.js';

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

function camelCaseToSpaceSeparated(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function downloadDictAsJson(obj) {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(obj))}`;
  const a = document.createElement('a');
  a.href = data;
  a.download = 'teto-template.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function uploadJsonFromDisk(callback) {
  function readFile(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function execCallback(event) {
      const contents = event.target.result;
      fileInput.func(contents);
      document.body.removeChild(fileInput);
    };
    reader.readAsText(file);
  }
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  fileInput.onchange = readFile;
  fileInput.func = callback;
  document.body.appendChild(fileInput);
  fileInput.click();
}

function generateBlockPreview(blockType, blockOpts) {
  const previewSize = 288;

  const optionsCopy = JSON.parse(JSON.stringify(globalOptionsConfig));
  const previewOptions = new Options(optionsCopy, 'preview');
  previewOptions.opts.borderMargin.value = 0;
  previewOptions.opts.borderRadius.value = 15;
  previewOptions.opts.titleFontSize.value = 28;
  previewOptions.opts.titlePadding.value = 8;

  const previewGrid = {
    x: previewSize / 3,
    y: previewSize / 3,
    offset: { x: 0, y: 0 },
  };

  const img = new Image();
  img.onload = function onImgLoad() {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctxt = canvas.getContext('2d');
    ctxt.fillStyle = '#fff';
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    ctxt.drawImage(img, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    const previewContainer = document.getElementById(`library-${blockType}`);
    previewContainer.src = imageData;
  };

  const renderDiv = document.getElementById('render-container');
  const block = new blockOpts.Class(previewGrid, previewOptions);
  block.blockOpts.opts.titleText.value = camelCaseToSpaceSeparated(blockType);
  block.add(renderDiv);
  block.svg.setAttribute('width', previewSize);
  block.svg.setAttribute('height', previewSize);
  removeChildren(renderDiv);

  const svgText = (new XMLSerializer()).serializeToString(block.svg);
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
}

export {
  calcGrid,
  downloadSvgAsPng,
  htmlToElement,
  removeChildren,
  downloadDictAsJson,
  uploadJsonFromDisk,
  generateBlockPreview,
};
