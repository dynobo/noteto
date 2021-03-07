/**
 * Helper methods that render/insert element in the DOM
 */
import { Graphics } from './index.js';

const Render = {
  /**
   * Draw resized image on a canvas object.
   * @param {Element} img <img> element containing the image to draw
   * @param {Element} canvas <canvas> element where to draw on
   */
  drawResizedImgOnCanvas(img, canvas) {
    const previewGrid = { x: 93.6, y: 93.6 };
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,
      0, 0,
      previewGrid.x * 3, previewGrid.y * 3,
      0, 0,
      288, 288);
  },

  /**
   * Append previews for blocks to the target container and adds click listener
   * @param {Element} targetContainer Container element for library to append previews to
   * @param {Object} blockTypes Contains BlockType (Name) and the Class to instanciate
   * @param {Function} onClickListener Listener that gets added to the preview and executed on click
   */
  renderBlockLibrary(targetContainer, blockTypes, onClickListener) {
    // Add preview for every block type
    Object.entries(blockTypes).forEach(([blockType, BlockClass]) => {
      // Create canvas to draw preview on
      const previewCanvas = document.createElement('canvas');
      previewCanvas.setAttribute('id', `library-${blockType}`);
      previewCanvas.setAttribute('width', '288px');
      previewCanvas.setAttribute('height', '288px');
      previewCanvas.setAttribute('class', 'image is-96x96');

      // Canvas needs surrounding div for sizing
      const containerDiv = document.createElement('div');
      containerDiv.append(previewCanvas);
      targetContainer.append(containerDiv);

      // What to do if preview is clicked
      containerDiv.addEventListener('click', () => { onClickListener(BlockClass); });

      // Finally generate the preview image and draw it on the preview canvas
      Graphics.generateBlockPreview(blockType, BlockClass, (tempImg) => {
        Render.drawResizedImgOnCanvas(tempImg, previewCanvas);
      });
    });
  },

  /**
   * Load a font file from an URL, encode it as Base64 and append it as style to an Element.
   * @param {str} fontName Desired name of the font. Will be post-fixed by 'B64'
   * @param {str} fileUrl Url to font file
   * @param {Element} element DOM element to which the <style> tag is appended
   */
  addStyleWithFontFamilyB64(fontName, fileUrl, element) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', fileUrl, true);
    xhr.onerror = (() => { console.error('Error occurred while loading the font file.'); });
    xhr.onload = function onload() {
      if (this.status === 200) {
        const codes = new Uint8Array(this.response);
        const bin = String.fromCharCode.apply(null, codes);
        const fontBase64 = btoa(bin);
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.innerHTML = `
        @font-face {
          font-family: '${fontName}b64';
          src: url(data:font/woff2;base64,${fontBase64});
        }`;
        element.appendChild(style);
      }
    };
    xhr.send();
  },
};

export default Render;
