import BaseBlock from './BaseBlock.js';

class LineBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Line Block';
    this.blockOpts.opts.titleText.value = 'Notes';
  }

  clearLines() {
    const lines = this.svg.querySelectorAll('.horizontal-line');
    lines.forEach((line) => {
      line.remove();
    });
  }

  renderLines() {
    const borderMargin = this.globalOpts.get('borderMargin');
    const borderStrokeWidth = this.globalOpts.get('borderStrokeWidth');
    const titlePadding = this.globalOpts.get('titlePadding');
    const titleFontSize = this.globalOpts.get('titleFontSize');
    const lineDistance = this.globalOpts.get('lineDistance');
    const lineStrokeWidth = this.globalOpts.get('lineStrokeWidth');
    const lineStrokeColor = this.globalOpts.get('lineStrokeColor');

    // Number of lines to draw
    const lineCount = this.height / lineDistance;

    // Offset depends on title visibility
    let yOffset = borderMargin;
    if (this.blockOpts.get('titleText').length > 0) {
      yOffset += titleFontSize + titlePadding * 2;
    }

    // Draw lines
    for (let i = 1; i <= lineCount; i += 1) {
      // Use filled rect as line, because line doesn't work well with mask
      const lineRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lineRect.setAttribute('class', 'horizontal-line');
      lineRect.setAttribute('x', borderMargin + borderStrokeWidth);
      lineRect.setAttribute('y', lineDistance * i + yOffset);
      lineRect.setAttribute('width', this.width - borderMargin * 2 - borderStrokeWidth * 2);
      lineRect.setAttribute('height', lineStrokeWidth);
      lineRect.setAttribute('fill', lineStrokeColor);
      lineRect.setAttribute('mask', `url(#${this.id}_clip)`);
      this.svg.appendChild(lineRect);
    }
  }

  onRender() {
    this.clearLines();
    this.renderLines();
  }
}

export default LineBlock;
