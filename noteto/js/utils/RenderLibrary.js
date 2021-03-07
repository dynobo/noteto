/**
 * Helper methods that render and/or insert elements in the DOM
 */
import { GraphicUtils } from './index.js';

const RenderLibrary = {
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
      GraphicUtils.generateBlockPreview(blockType, BlockClass, (tempImg) => {
        RenderLibrary.drawResizedImgOnCanvas(tempImg, previewCanvas);
      });
    });
  },
};

export default RenderLibrary;
