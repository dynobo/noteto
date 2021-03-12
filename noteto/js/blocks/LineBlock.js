import BaseBlock from './BaseBlock.js';

class LineBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Line Block';
    this.opts.titleText.value = 'Notes';

    // Append options specific to this block
    this.opts.add({
      lineStrokeWidth: {
        group: 'Lines',
        label: 'Line Width',
        type: 'number',
        value: 1,
      },
      lineDistance: {
        group: 'Lines',
        label: 'Line Distance',
        type: 'number',
        value: 75,
      },
      lineStrokeColor: {
        group: 'Lines',
        label: 'Line Color',
        type: 'color',
        value: '#777777',
      },
    });
  }

  /**
   * Delete all line from block.
   */
  clearLines() {
    const lines = this.svg.querySelectorAll('.horizontal-line');
    lines.forEach((line) => {
      line.remove();
    });
  }

  /**
   * Add line to block and style them.
   */
  renderLines() {
    const lineDistance = this.opts.get('lineDistance');
    const lineStrokeWidth = this.opts.get('lineStrokeWidth');
    const lineStrokeColor = this.opts.get('lineStrokeColor');

    // Number of lines to draw
    const lineCount = this.innerHeight / lineDistance;

    // Draw lines
    for (let i = 1; i <= lineCount; i += 1) {
      // Use filled rect as line, because line doesn't work well with mask
      const lineRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lineRect.setAttribute('class', 'horizontal-line');
      lineRect.setAttribute('x', this.xOffset);
      lineRect.setAttribute('y', lineDistance * i + this.yOffset);
      lineRect.setAttribute('width', this.innerWidth);
      lineRect.setAttribute('height', lineStrokeWidth);
      lineRect.setAttribute('fill', lineStrokeColor);
      lineRect.setAttribute('mask', `url(#${this.id}_clip)`);
      this.svg.appendChild(lineRect);
    }
  }

  /**
   * Hook that gets execute after rendering of the parents class elements
   */
  onRender() {
    this.clearLines();
    this.renderLines();
  }
}

export default LineBlock;
