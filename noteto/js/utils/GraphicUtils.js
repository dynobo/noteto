/**
 * Helper methods to manipulate canvas and other graphic related things.
 */
import { globalOptionsConfig } from '../config.js';
import Options from '../blocks/Options.js';
import { DomUtils } from './index.js';

const GraphicUtils = {
  /**
 * Convert a SVG element to a CANVAS element (with white background).
 * @param {SVG} svg Element to convert to canvas
 * @param {Function} callback Function that gets call when canvas is ready, with the canvas as argument
      */
  convertSvgToCanvas(svg, callback) {
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
  },

  /**
   *
   * @param {str} blockType Name of the block type, will be rendered as title
   * @param {BaseBlock} BlockClass Class of the block to instanciate
   * @param {Function} callback Called when rendering is complete. Gets an <img> object as argument.
   */
  generateBlockPreview(blockType, BlockClass, callback) {
    // Render larger than shown to improve quality
    const previewSize = 3 * 96;

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

    GraphicUtils.convertSvgToCanvas(renderContainer, (canvas) => {
      const img = document.createElement('img');
      img.setAttribute('src', canvas.toDataURL('image/png'));
      img.onload = function onload() {
        callback(img);
      };
    });
    DomUtils.removeElements(renderContainer.querySelectorAll('svg'));
  },
};

export default GraphicUtils;
