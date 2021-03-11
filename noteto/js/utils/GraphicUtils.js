/**
 * Helper methods to manipulate canvas and other graphic related things.
 */
import DomUtils from './DomUtils.js';

const GraphicUtils = {
  /**
 * Convert a SVG element to a CANVAS element (with white background).
 * @param {SVG} svg Element to convert to canvas
 * @param {Function} callback Function that gets call when canvas is ready, with the canvas as argument
      */
  convertSvgToCanvas(svg, callback) {
    const svgCopy = svg.cloneNode(true);
    const remarkableElements = svgCopy.getElementById('remarkable-elements');
    remarkableElements.parentNode.removeChild(remarkableElements);

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
    const xml = new XMLSerializer().serializeToString(svgCopy);
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
    const previewSize = 600;
    const previewGrid = {
      x: 60,
      y: 60,
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

  renderRemarkableElements(svg) {
    const color = 'black';
    const opacity = 0.07;

    const remarkableElements = svg.getElementById('remarkable-elements');
    const sidebarRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sidebarRect.setAttribute('x', 0);
    sidebarRect.setAttribute('y', 0);
    sidebarRect.setAttribute('width', 120);
    sidebarRect.setAttribute('height', svg.height.baseVal.value);
    sidebarRect.setAttribute('fill', color);
    sidebarRect.setAttribute('opacity', opacity);
    remarkableElements.appendChild(sidebarRect);

    const sidebarCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sidebarCircle.setAttribute('cx', 60);
    sidebarCircle.setAttribute('cy', 60);
    sidebarCircle.setAttribute('r', 20);
    sidebarCircle.setAttribute('fill', 'transparent');
    sidebarCircle.setAttribute('stroke', color);
    sidebarCircle.setAttribute('stroke-width', 4);
    sidebarCircle.setAttribute('opacity', opacity);
    remarkableElements.appendChild(sidebarCircle);

    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', 55);
    innerCircle.setAttribute('cy', 55);
    innerCircle.setAttribute('r', 8);
    innerCircle.setAttribute('fill', color);
    innerCircle.setAttribute('opacity', opacity);
    remarkableElements.appendChild(innerCircle);

    const closeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    closeCircle.setAttribute('cx', svg.width.baseVal.value - 60);
    closeCircle.setAttribute('cy', 60);
    closeCircle.setAttribute('r', 20);
    closeCircle.setAttribute('fill', 'transparent');
    closeCircle.setAttribute('stroke', 'black');
    closeCircle.setAttribute('stroke-width', 4);
    closeCircle.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeCircle);

    const closeX1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    closeX1.setAttribute('x1', svg.width.baseVal.value - 65);
    closeX1.setAttribute('y1', 65);
    closeX1.setAttribute('x2', svg.width.baseVal.value - 55);
    closeX1.setAttribute('y2', 55);
    closeX1.setAttribute('stroke', 'black');
    closeX1.setAttribute('stroke-width', 4);
    closeX1.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeX1);

    const closeX2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    closeX2.setAttribute('x1', svg.width.baseVal.value - 65);
    closeX2.setAttribute('y1', 55);
    closeX2.setAttribute('x2', svg.width.baseVal.value - 55);
    closeX2.setAttribute('y2', 65);
    closeX2.setAttribute('stroke', 'black');
    closeX2.setAttribute('stroke-width', 4);
    closeX2.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeX2);
  },
};

export default GraphicUtils;
