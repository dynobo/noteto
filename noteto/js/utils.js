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

function convertSvgToPng(svg, callback) {
  const img = new Image();
  img.onload = function onImgLoad() {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctxt = canvas.getContext('2d');
    // ctxt.font = '26pt Roboto';
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

function downloadSvgAsPng() {
  const svg = document.getElementById('paper-svg');
  convertSvgToPng(svg, (canvas) => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'noteto-template.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
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

function removeNodes(els) {
  els.forEach((el) => {
    el.parentElement.removeChild(el);
  });
}

function camelCaseToSpaceSeparated(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function downloadDictAsJson(obj) {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(obj))}`;
  const a = document.createElement('a');
  a.href = data;
  a.download = 'noteto-template.json';
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

  const block = new blockOpts.Class(previewGrid, previewOptions);
  block.blockOpts.opts.titleText.value = camelCaseToSpaceSeparated(blockType);
  block.add(renderContainer);
  block.svg.setAttribute('width', previewSize);
  block.svg.setAttribute('height', previewSize);

  convertSvgToPng(renderContainer, (canvas) => {
    const img = document.createElement('img');
    img.setAttribute('src', canvas.toDataURL('image/png'));
    const targetCanvas = document.getElementById(`library-${blockType}`);
    const ctx = targetCanvas.getContext('2d');
    img.onload = function () {
      ctx.drawImage(img,
        0, 0,
        previewGrid.x * 3, previewGrid.y * 3,
        0, 0,
        288, 288);
    };
  });
  removeNodes(renderContainer.querySelectorAll('svg'));
}

function loadFont(fontName, file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
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
  xhr.onerror = function () {
    alert(`Error ${FocusEvent.target.status} occurred while receiving the document.`);
  };
  xhr.send();
}

export {
  loadFont,
  calcGrid,
  downloadSvgAsPng,
  htmlToElement,
  removeChildren,
  removeNodes,
  downloadDictAsJson,
  uploadJsonFromDisk,
  generateBlockPreview,
};
