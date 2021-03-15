/**
 * Helper methods that render and/or insert elements in the DOM
 */
import GraphicUtils from './GraphicUtils.js';
import Config from '../config.js';
import DomUtils from './DomUtils.js';

const RenderLibrary = {
  /**
   * Draw resized image on a canvas object.
   * @param {Element} img <img> element containing the image to draw
   * @param {Element} canvas <canvas> element where to draw on
   */
  drawResizedImgOnCanvas(img, canvas) {
    const previewGrid = { x: 12, y: 12 };
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,
      Config.pagePadding, Config.pagePadding,
      previewGrid.x * 30, previewGrid.y * 30,
      0, 0,
      96 * 4, 96 * 4);
  },

  /**
   *
   * @param {str} blockType Name of the block type, will be rendered as title
   * @param {BaseBlock} BlockClass Class of the block to instanciate
   * @param {Function} callback Called when rendering is complete. Gets an <img> object as argument.
   */
  generateBlockPreview(blockType, BlockClass, callback) {
    // Render larger than shown to improve quality
    const previewSize = 384;
    const previewGrid = {
      x: 0,
      y: 0,
      size: 12,
      offset: { x: 285, y: 15 },
      padding: 0,
    };
    const renderContainer = document.getElementById('paper-svg');

    const block = new BlockClass(previewGrid);
    block.opts.titleText.value = blockType;
    block.opts.borderMargin.value = 0;
    block.opts.borderRadius.value = 15;
    block.opts.titleFontSize.value = 28;
    block.opts.titlePadding.value = 8;

    block.addTo(renderContainer);
    block.root.setAttribute('width', previewSize);
    block.root.setAttribute('height', previewSize);

    GraphicUtils.convertSvgToCanvas(renderContainer, (canvas) => {
      const img = document.createElement('img');
      img.setAttribute('src', canvas.toDataURL('image/png'));
      img.onload = function onload() {
        callback(img);
      };
    });
    DomUtils.removeElements(renderContainer.querySelectorAll('.dragit'));
  },

  /**
   * Append previews for blocks to the target container and adds click listener
   * @param {Element} targetContainer Container element for library to append previews to
   * @param {Object} BlockTypes Contains BlockType (Name) and the Class to instanciate
   * @param {Function} onClickListener Listener that gets added to the preview and executed on click
   */
  renderBlockLibrary(targetContainer, BlockTypes, onClickListener) {
    // Add preview for every block type
    Object.entries(BlockTypes).forEach(([blockType, BlockClass]) => {
      // Create canvas to draw preview on
      const previewCanvas = document.createElement('canvas');
      previewCanvas.setAttribute('id', `library-${blockType}`);
      previewCanvas.setAttribute('width', '384px');
      previewCanvas.setAttribute('height', '384px');
      previewCanvas.setAttribute('class', 'image is-96x96');

      // Canvas needs surrounding div for sizing
      const containerDiv = document.createElement('div');
      containerDiv.append(previewCanvas);
      targetContainer.append(containerDiv);

      // What to do if preview is clicked
      containerDiv.addEventListener('click', () => { onClickListener(BlockClass); });

      // Finally generate the preview image and draw it on the preview canvas
      this.generateBlockPreview(blockType, BlockClass, (tempImg) => {
        RenderLibrary.drawResizedImgOnCanvas(tempImg, previewCanvas);
      });
    });
  },
};

export default RenderLibrary;
