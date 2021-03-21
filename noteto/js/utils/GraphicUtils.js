/**
 * Helper methods to manipulate canvas and other graphic related things.
 */

const GraphicUtils = {
  /**
 * Convert a SVG element to a CANVAS element (with white background).
 * @param {SVG} svg Element to convert to canvas
 * @param {Function} callback Function that gets call when canvas is ready, with the canvas as argument
      */
  convertSvgToCanvas(svg, callback) {
    const svgCopy = svg.cloneNode(true);
    const viewElements = svgCopy.getElementById('view-elements');
    viewElements.parentNode.removeChild(viewElements);

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

  renderRemarkableElementsLefthand(svg) {
    const color = 'black';
    const opacity = 0.07;

    const remarkableElements = svg.getElementById('remarkable-elements-lefthand');
    const sidebarRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sidebarRect.setAttribute('x', svg.width.baseVal.value - 120);
    sidebarRect.setAttribute('y', 0);
    sidebarRect.setAttribute('width', 120);
    sidebarRect.setAttribute('height', svg.height.baseVal.value);
    sidebarRect.setAttribute('fill', color);
    sidebarRect.setAttribute('opacity', opacity);
    remarkableElements.appendChild(sidebarRect);

    const sidebarCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sidebarCircle.setAttribute('cx', svg.width.baseVal.value - 60);
    sidebarCircle.setAttribute('cy', 60);
    sidebarCircle.setAttribute('r', 20);
    sidebarCircle.setAttribute('fill', 'transparent');
    sidebarCircle.setAttribute('stroke', color);
    sidebarCircle.setAttribute('stroke-width', 4);
    sidebarCircle.setAttribute('opacity', opacity);
    remarkableElements.appendChild(sidebarCircle);

    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', svg.width.baseVal.value - 65);
    innerCircle.setAttribute('cy', 55);
    innerCircle.setAttribute('r', 8);
    innerCircle.setAttribute('fill', color);
    innerCircle.setAttribute('opacity', opacity);
    remarkableElements.appendChild(innerCircle);

    const closeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    closeCircle.setAttribute('cx', 60);
    closeCircle.setAttribute('cy', 60);
    closeCircle.setAttribute('r', 20);
    closeCircle.setAttribute('fill', 'transparent');
    closeCircle.setAttribute('stroke', 'black');
    closeCircle.setAttribute('stroke-width', 4);
    closeCircle.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeCircle);

    const closeX1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    closeX1.setAttribute('x1', 65);
    closeX1.setAttribute('y1', 65);
    closeX1.setAttribute('x2', 55);
    closeX1.setAttribute('y2', 55);
    closeX1.setAttribute('stroke', 'black');
    closeX1.setAttribute('stroke-width', 4);
    closeX1.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeX1);

    const closeX2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    closeX2.setAttribute('x1', 65);
    closeX2.setAttribute('y1', 55);
    closeX2.setAttribute('x2', 55);
    closeX2.setAttribute('y2', 65);
    closeX2.setAttribute('stroke', 'black');
    closeX2.setAttribute('stroke-width', 4);
    closeX2.setAttribute('opacity', 0.1);
    remarkableElements.appendChild(closeX2);
  },

  renderGuideLines(svg) {
    const color = '#ffdd57';
    const opacity = 0.5;

    const remarkableElements = svg.getElementById('page-lines');

    // Horizontal Lines
    const centerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    centerLine.setAttribute('x1', parseInt(svg.width.baseVal.value / 2, 10));
    centerLine.setAttribute('y1', 0);
    centerLine.setAttribute('x2', parseInt(svg.width.baseVal.value / 2, 10));
    centerLine.setAttribute('y2', svg.height.baseVal.value);
    centerLine.setAttribute('stroke', color);
    centerLine.setAttribute('stroke-width', 1);
    centerLine.setAttribute('opacity', opacity * 2);
    remarkableElements.appendChild(centerLine);

    const hFirstThird = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hFirstThird.setAttribute('x1', parseInt(svg.width.baseVal.value / 3, 10));
    hFirstThird.setAttribute('y1', 0);
    hFirstThird.setAttribute('x2', parseInt(svg.width.baseVal.value / 3, 10));
    hFirstThird.setAttribute('y2', svg.height.baseVal.value);
    hFirstThird.setAttribute('stroke', color);
    hFirstThird.setAttribute('stroke-width', 1);
    hFirstThird.setAttribute('opacity', opacity);
    remarkableElements.appendChild(hFirstThird);

    const hSecondThird = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hSecondThird.setAttribute('x1', parseInt((svg.width.baseVal.value / 3) * 2, 10));
    hSecondThird.setAttribute('y1', 0);
    hSecondThird.setAttribute('x2', parseInt((svg.width.baseVal.value / 3) * 2, 10));
    hSecondThird.setAttribute('y2', svg.height.baseVal.value);
    hSecondThird.setAttribute('stroke', color);
    hSecondThird.setAttribute('stroke-width', 1);
    hSecondThird.setAttribute('opacity', opacity);
    remarkableElements.appendChild(hSecondThird);

    // Vertical Lines
    const middleLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    middleLine.setAttribute('x1', 0);
    middleLine.setAttribute('y1', parseInt(svg.height.baseVal.value / 2, 10));
    middleLine.setAttribute('x2', svg.width.baseVal.value);
    middleLine.setAttribute('y2', parseInt(svg.height.baseVal.value / 2, 10));
    middleLine.setAttribute('stroke', color);
    middleLine.setAttribute('stroke-width', 1);
    middleLine.setAttribute('opacity', opacity * 2);
    remarkableElements.appendChild(middleLine);

    const vFirstThird = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vFirstThird.setAttribute('x1', 0);
    vFirstThird.setAttribute('y1', parseInt(svg.height.baseVal.value / 3, 10));
    vFirstThird.setAttribute('x2', svg.width.baseVal.value);
    vFirstThird.setAttribute('y2', parseInt(svg.height.baseVal.value / 3, 10));
    vFirstThird.setAttribute('stroke', color);
    vFirstThird.setAttribute('stroke-width', 1);
    vFirstThird.setAttribute('opacity', opacity);
    remarkableElements.appendChild(vFirstThird);

    const vSecondThird = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vSecondThird.setAttribute('x1', 0);
    vSecondThird.setAttribute('y1', parseInt((svg.height.baseVal.value / 3) * 2, 10));
    vSecondThird.setAttribute('x2', svg.width.baseVal.value);
    vSecondThird.setAttribute('y2', parseInt((svg.height.baseVal.value / 3) * 2, 10));
    vSecondThird.setAttribute('stroke', color);
    vSecondThird.setAttribute('stroke-width', 1);
    vSecondThird.setAttribute('opacity', opacity);
    remarkableElements.appendChild(vSecondThird);
  },

  renderGridLines(svg) {
    const color = 'black';

    const remarkableElements = svg.getElementById('gridlines');

    // Horizontal Lines
    let opacity;
    let line;
    let i = 0;
    while (i < svg.width.baseVal.value) {
      i += 12;
      if (i % 48 === 0) {
        opacity = 0.04 * 3;
      } else {
        opacity = 0.04;
      }
      line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', i, 10);
      line.setAttribute('y1', 0);
      line.setAttribute('x2', i, 10);
      line.setAttribute('y2', svg.height.baseVal.value);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', 1);
      line.setAttribute('opacity', opacity);
      remarkableElements.appendChild(line);
    }

    // Vertical Lines
    i = 0;
    while (i < svg.height.baseVal.value) {
      i += 12;
      if (i % 48 === 0) {
        opacity = 0.04 * 3;
      } else {
        opacity = 0.04;
      }
      line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', i);
      line.setAttribute('x2', svg.width.baseVal.value);
      line.setAttribute('y2', i);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', 1);
      line.setAttribute('opacity', opacity);
      remarkableElements.appendChild(line);
    }
  },
};

export default GraphicUtils;
