import Options from './Options.js';

class BaseBlock {
  constructor(grid, globalOptions) {
    // Unique ID to identify an individual block instance
    this.id = `id_${Math.random().toString(16).slice(2)}`;
    this.type = 'BaseBlock';

    // Position information. Handled by interact.js. Don't change manually.
    this.width = grid.x * 3;
    this.height = grid.y * 3;
    this.x = 0;
    this.y = 0;
    this.dataX = 0;
    this.dataY = 0;

    this.globalOpts = globalOptions;

    // Define block specific options
    // (will show up in the left sidebar on block select)
    this.blockOpts = new Options({
      titleText: {
        group: 'Base Settings',
        label: 'Title',
        type: 'text',
        value: 'Click to adjust options',
      },
    }, this.id);

    this.createBaseElements();
  }

  get innerWidth() {
    return (this.width
      - this.globalOpts.get('borderStrokeWidth') * 2
      - this.globalOpts.get('borderMargin') * 2);
  }

  get innerHeight() {
    let innerHeight = (this.height
      - this.globalOpts.get('borderStrokeWidth') * 2
      - this.globalOpts.get('borderMargin') * 2);
    if (this.blockOpts.get('titleText').length > 0) {
      innerHeight -= this.globalOpts.get('titleFontSize');
      innerHeight -= this.globalOpts.get('titlePadding') * 2;
    }
    return innerHeight;
  }

  get xOffset() {
    return this.globalOpts.get('borderStrokeWidth') + this.globalOpts.get('borderMargin');
  }

  get yOffset() {
    let yOffset = this.globalOpts.get('borderStrokeWidth') + this.globalOpts.get('borderMargin');
    if (this.blockOpts.get('titleText').length > 0) {
      yOffset += this.globalOpts.get('titleFontSize') + this.globalOpts.get('titlePadding') * 2;
    }
    return yOffset;
  }

  createBaseElements() {
    // Block Container
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.styleDef = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    defs.append(this.styleDef);
    this.svg.append(defs);

    // Mask to crop off everything outside the border
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    this.maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mask.appendChild(this.maskRect);
    mask.setAttribute('id', `${this.id}_clip`);
    this.svg.appendChild(mask);

    // Add border and empty group for title
    this.borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.titleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.borderRect);
    this.svg.appendChild(this.titleGroup);
  }

  add(svgRoot) {
    const content_group = svgRoot.querySelector('.content-group');
    content_group.appendChild(this.svg);
    this.render();
  }

  remove() {
    const blockSvg = document.getElementById(this.id);
    if (blockSvg) {
      blockSvg.parentNode.removeChild(blockSvg);
    }
  }

  renderTitle() {
    this.titleGroup.innerHTML = '';
    if (this.blockOpts.get('titleText').length <= 0) {
      return;
    }
    const borderMargin = this.globalOpts.get('borderMargin');
    const borderStrokeWidth = this.globalOpts.get('borderStrokeWidth');
    const titlePadding = this.globalOpts.get('titlePadding');
    const titleFontSize = this.globalOpts.get('titleFontSize');
    const titleFontColor = this.globalOpts.get('titleFontColor');
    const titleBackgroundColor = this.globalOpts.get('titleBackgroundColor');

    this.titleGroup.setAttribute('mask', `url(#${this.id}_clip)`);

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', borderMargin + borderStrokeWidth);
    rect.setAttribute('y', borderMargin + borderStrokeWidth);
    rect.setAttribute('width', this.width - borderStrokeWidth * 2 - borderMargin * 2);
    rect.setAttribute('height', titleFontSize + titlePadding * 2);
    rect.setAttribute('fill', titleBackgroundColor);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', borderMargin + borderStrokeWidth + titlePadding);
    text.setAttribute(
      'y',
      borderMargin + borderStrokeWidth + titlePadding + titleFontSize * 0.8,
    );
    text.setAttribute('font-size', titleFontSize);
    text.setAttribute('fill', titleFontColor);
    text.textContent = this.blockOpts.get('titleText');

    this.titleGroup.append(rect);
    this.titleGroup.append(text);
  }

  renderStyleDef() {
    this.styleDef.innerHTML = `
    #${this.id} text {
      font-family: '${this.globalOpts.get('fontFamily')}b64';
    }
    #${this.id} text.icon {
      font-family: 'FontAwesomeb64';
    }`;
  }

  renderBorder() {
    const borderMargin = this.globalOpts.get('borderMargin');
    const borderStrokeWidth = this.globalOpts.get('borderStrokeWidth');
    const borderRadius = this.globalOpts.get('borderRadius');
    const borderStrokeColor = this.globalOpts.get('borderStrokeColor');

    this.svg.classList.add('dragit');
    this.svg.setAttribute('id', this.id);
    this.svg.setAttribute('version', '1.2');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.svg.setAttribute('x', this.x);
    this.svg.setAttribute('y', this.y);
    this.svg.setAttribute('data-x', this.dataX);
    this.svg.setAttribute('data-y', this.dataY);
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);

    this.borderRect.classList.add('blockBorder');
    this.borderRect.setAttribute('x', borderMargin + borderStrokeWidth / 2);
    this.borderRect.setAttribute('y', borderMargin + borderStrokeWidth / 2);
    this.borderRect.setAttribute('width', this.width - borderStrokeWidth - borderMargin * 2);
    this.borderRect.setAttribute('height', this.height - borderStrokeWidth - borderMargin * 2);
    this.borderRect.setAttribute('fill', 'white');
    this.borderRect.setAttribute('stroke', borderStrokeColor);
    this.borderRect.setAttribute('stroke-width', borderStrokeWidth);
    this.borderRect.setAttribute('rx', borderRadius);
    this.borderRect.setAttribute('ry', borderRadius);

    this.maskRect.classList.add('clipBorder');
    this.maskRect.setAttribute('x', borderMargin + borderStrokeWidth / 2);
    this.maskRect.setAttribute('y', borderMargin + borderStrokeWidth / 2);
    this.maskRect.setAttribute('width', this.width - borderStrokeWidth - borderMargin * 2);
    this.maskRect.setAttribute('height', this.height - borderStrokeWidth - borderMargin * 2);
    this.maskRect.setAttribute('stroke-width', borderStrokeWidth);
    this.maskRect.setAttribute('rx', borderRadius);
    this.maskRect.setAttribute('ry', borderRadius);
    this.maskRect.setAttribute('fill', 'white');
    this.maskRect.setAttribute('stroke', 'black');
  }

  onRender() {
    // To be overwritten by child classes to render block specific element
    return this;
  }

  render() {
    this.renderStyleDef();
    this.renderTitle();
    this.renderBorder();
    this.onRender();
  }
}

export default BaseBlock;
