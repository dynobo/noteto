import BaseBlock from './BaseBlock.js';

class TimeBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'TimeBlock';
    this.blockOpts.opts.titleText.value = 'Agenda';

    // Extend block specific options
    // (will show up in the left sidebar on block select)

    this.blockOpts.opts = {
      ...this.blockOpts.opts,
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
    };
  }

  clearLines() {
    const lines = this.svg.querySelectorAll('.horizontal-line');
    lines.forEach((line) => {
      line.remove();
    });
    const hourLabels = this.svg.querySelectorAll('.hour-label');
    hourLabels.forEach((label) => {
      label.remove();
    });
  }

  renderLines() {
    const borderMargin = this.globalOpts.get('borderMargin');
    const borderStrokeWidth = this.globalOpts.get('borderStrokeWidth');
    const titlePadding = this.globalOpts.get('titlePadding');
    const titleFontSize = this.globalOpts.get('titleFontSize');
    const lineStrokeWidth = this.globalOpts.get('lineStrokeWidth');
    const lineStrokeColor = this.globalOpts.get('lineStrokeColor');

    const startHour = this.blockOpts.get('startHour');
    const endHour = this.blockOpts.get('endHour');
    const linesPerHour = this.blockOpts.get('linesPerHour');
    const hourFontSize = this.blockOpts.get('hourFontSize');

    // Offset depends on title visibility
    let yOffset = borderMargin;
    if (this.blockOpts.get('titleText').length > 0) {
      yOffset += titleFontSize + titlePadding * 2;
    }

    // Number of lines to draw
    const lineCount = (endHour - startHour + 1) * linesPerHour;
    const lineDistance = (this.height - yOffset) / lineCount;

    // Draw lines
    let currentHour = startHour;
    let maxLabelWidth = 0;
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
      if ((i) % linesPerHour !== 0) {
        lineRect.setAttribute('opacity', '0.35');
      }
      this.svg.appendChild(lineRect);

      // Add labels
      if ((i - 1) % linesPerHour === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'hour-label');
        text.setAttribute('font-size', hourFontSize);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('dominant-baseline', 'central');
        text.textContent = `${currentHour}:00`;
        text.setAttribute('y', lineDistance * i + yOffset - lineDistance * 0.5);
        this.svg.appendChild(text);
        currentHour += 1;
        maxLabelWidth = Math.max(maxLabelWidth, text.getBBox().width);
      }
    }

    // Align labels to the right
    const hourLabels = this.svg.querySelectorAll('.hour-label');
    hourLabels.forEach((label) => {
      label.setAttribute('x', borderMargin + borderStrokeWidth + maxLabelWidth + titlePadding);
    });
  }

  onRender() {
    this.clearLines();
    this.renderLines();
  }
}

export default TimeBlock;
