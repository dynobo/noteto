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

/**
 * Convert a SVG element to a CANVAS element (with white background).
 * @param {SVG} svg Element to convert to canvas
 * @param {func} callback Function that gets call when canvas is ready, with the canvas as argument
 */
function convertSvgToCanvas(svg, callback) {
  const img = new Image();
  img.onload = function onImgLoad() {
    // Create canvas and fill from image
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctxt = canvas.getContext('2d');
    ctxt.fillStyle = '#fff';
    ctxt.fillRect(0, 0, canvas.width, canvas.height);
    ctxt.drawImage(img, 0, 0);
    callback(canvas);
  };
  // Serialize and insert into image
  const xml = new XMLSerializer().serializeToString(svg);
  const data = `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
  img.setAttribute('src', data);
}

// TODO: svg as arg
// TODO: Add file name as parameter
function downloadSvgAsPng() {
  const svg = document.getElementById('paper-svg');
  convertSvgToCanvas(svg, (canvas) => {
    // Put encoded file into <a> href
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'noteto-template.png';
    document.body.appendChild(a);
    // Trigger download dialog
    a.click();
    document.body.removeChild(a);
  });
}

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

/**
 * Convert JS-Object as JSON and triggers its download.
 * @param {Object} obj JavaScript object to be transformed to json
 */
// TODO: Add file name as parameter
function downloadObjectAsJson(obj) {
  const encodedObj = encodeURIComponent(JSON.stringify(obj));
  const data = `data:text/json;charset=utf-8,${encodedObj}`;
  const a = document.createElement('a');
  a.href = data;
  a.download = 'noteto-template.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function uploadJsonFromDisk(callback) {
  const fileInput = document.createElement('input');
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
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.style.display = 'none';
  fileInput.onchange = readFile;
  fileInput.func = callback;
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function generateBlockPreview(blockType, BlockClass) {
  const previewSize = 288;

  // Prepare Block
  const optionsCopy = JSON.parse(JSON.stringify(globalOptionsConfig));
  const previewOptions = new Options(optionsCopy, 'preview');
  previewOptions.opts.borderMargin.value = 0;
  previewOptions.opts.borderRadius.value = 15;
  previewOptions.opts.titleFontSize.value = 28;
  previewOptions.opts.titlePadding.value = 8;

  const previewGrid = {
    x: 93.6,
    y: 93.6,
    offset: { x: 285, y: 15 },
  };
  const renderContainer = document.getElementById('paper-svg');

  const block = new BlockClass(previewGrid, previewOptions);
  block.blockOpts.opts.titleText.value = blockType;
  block.add(renderContainer);
  block.svg.setAttribute('width', previewSize);
  block.svg.setAttribute('height', previewSize);

  convertSvgToCanvas(renderContainer, (canvas) => {
    const img = document.createElement('img');
    img.setAttribute('src', canvas.toDataURL('image/png'));
    const targetCanvas = document.getElementById(`library-${blockType}`);
    const ctx = targetCanvas.getContext('2d');
    img.onload = function onload() {
      ctx.drawImage(img,
        0, 0,
        previewGrid.x * 3, previewGrid.y * 3,
        0, 0,
        288, 288);
    };
  });
  removeElements(renderContainer.querySelectorAll('svg'));
}

function loadFont(fontName, file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function onload() {
    if (this.status === 200) {
      const codes = new Uint8Array(this.response);
      const bin = String.fromCharCode.apply(null, codes);
      const fontBase64 = btoa(bin);
      document.querySelectorAll('svg > defs.font-defs').forEach((defs) => {
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.innerHTML = `
        @font-face {
          font-family: '${fontName}b64';
          src: url(data:font/woff2;base64,${fontBase64});
        }`;
        defs.appendChild(style);
      });
    }
  };
  xhr.onerror = (() => {
    console.error('Error occurred while receiving the document.');
  });
  xhr.send();
}

export {
  loadFont,
  calcGrid,
  downloadSvgAsPng,
  htmlToElement,
  removeChildElements,
  removeElements,
  downloadObjectAsJson,
  uploadJsonFromDisk,
  generateBlockPreview,
};
