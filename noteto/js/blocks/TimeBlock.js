import BaseBlock from './BaseBlock.js';

class TimeBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Time Block';

    // Append options specific to this block
    const TimeBlockOptions = {
      hourFontSize: {
        group: 'Time Settings',
        label: 'Font Size',
        type: 'number',
        value: 24,
      },
      startHour: {
        group: 'Time Settings',
        label: 'Start (hour)',
        type: 'number',
        value: 8,
      },
      endHour: {
        group: 'Time Settings',
        label: 'End (hour)',
        type: 'number',
        value: 10,
      },
      linesPerHour: {
        group: 'Time Settings',
        label: 'Lines per Hour',
        type: 'number',
        value: 2,
      },
      lineStrokeWidth: {
        group: 'Lines',
        label: 'Line Width',
        type: 'number',
        value: 1,
      },
      lineStrokeColor: {
        group: 'Lines',
        label: 'Line Color',
        type: 'color',
        value: '#888888',
      },
    };
    this.opts.add(TimeBlockOptions);

    // Set values inherited by parent block class
    this.opts.titleText.value = 'Agenda';
  }

  /**
   * Delete all line from block.
   */
  clearLines() {
    const lines = this.svg.querySelectorAll('.horizontal-line, .hour-label');
    lines.forEach((line) => {
      line.remove();
    });
  }

  /**
   * Add line to block and style them.
   */
  renderLines() {
    const titlePadding = this.opts.get('titlePadding');
    const lineStrokeWidth = this.opts.get('lineStrokeWidth');
    const lineStrokeColor = this.opts.get('lineStrokeColor');

    const startHour = this.opts.get('startHour');
    const endHour = this.opts.get('endHour');
    const linesPerHour = this.opts.get('linesPerHour');
    const hourFontSize = this.opts.get('hourFontSize');

    // Number of lines to draw
    const lineCount = (endHour - startHour + 1) * linesPerHour;
    const lineDistance = (this.innerHeight) / lineCount;

    // Draw lines
    let currentHour = startHour;
    let maxLabelWidth = 0;
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
      // Make inter-hour lines semi-transparent
      if ((i) % linesPerHour !== 0) {
        lineRect.setAttribute('opacity', '0.5');
      }
      this.svg.appendChild(lineRect);

      // Add labels
      if ((i - 1) % linesPerHour === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'hour-label');
        text.setAttribute('font-size', hourFontSize);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('y', lineDistance * i + this.yOffset - lineDistance * 0.5);
        text.textContent = `${currentHour}:00`;
        this.svg.appendChild(text);
        currentHour += 1;
        maxLabelWidth = Math.max(maxLabelWidth, text.getBBox().width);
      }
    }

    // As we know the length of the longest label now, let's align labels to the right
    const hourLabels = this.svg.querySelectorAll('.hour-label');
    hourLabels.forEach((label) => {
      label.setAttribute('x', this.xOffset + maxLabelWidth + titlePadding);
    });
  }

  /**
   * Hook that gets execute after rendering of the parents class elements
   */
  onRender() {
    this.clearLines();
    this.renderLines();
  }
}

export default TimeBlock;
