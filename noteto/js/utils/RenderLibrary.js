/**
 * Helper methods that render and/or insert elements in the DOM
 */
import GraphicUtils from './GraphicUtils.js';
import Config from '../config.js';

const RenderLibrary = {
  /**
   * Draw resized image on a canvas object.
   * @param {Element} img <img> element containing the image to draw
   * @param {Element} canvas <canvas> element where to draw on
   */
  drawResizedImgOnCanvas(img, canvas) {
    const previewGrid = { x: 60, y: 60 };
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img,
      Config.pagePadding, Config.pagePadding,
      previewGrid.x * 5, previewGrid.y * 5,
      0, 0,
      96 * 4, 96 * 4);
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
      GraphicUtils.generateBlockPreview(blockType, BlockClass, (tempImg) => {
        RenderLibrary.drawResizedImgOnCanvas(tempImg, previewCanvas);
      });
    });
  },
};

export default RenderLibrary;
