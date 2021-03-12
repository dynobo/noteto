import Options from './Options.js';

class BaseBlock {
  constructor(grid) {
    // Unique ID to identify an individual block instance
    this.id = `id_${Math.random().toString(16).slice(11)}`;

    // Unique type to identify it in the library. This has to be added to config.js:BlockTypes
    this.type = 'Base Block';

    // Position information. Handled by interact.js. Don't change manually.
    this.width = grid.x * 5;
    this.height = grid.y * 5;
    this.x = grid.padding;
    this.y = grid.padding;
    this.dataX = 0;
    this.dataY = 0;

    const BaseBlockOptions = {
      // Block specific options, can not be global
      useGlobal: {
        group: 'Block',
        label: 'Use global Options',
        type: 'checkbox',
        value: true,
      },
      titleText: {
        group: 'Block',
        label: 'Title',
        type: 'text',
        value: 'Scribble',
      },
      // Global options, can be shared accross blocks
      borderMargin: {
        group: 'Borders',
        label: 'Border Margin',
        type: 'number',
        value: 4,
      },
      borderStrokeWidth: {
        group: 'Borders',
        label: 'Border Width',
        type: 'number',
        value: 2,
      },
      borderStrokeColor: {
        group: 'Borders',
        label: 'Border Color',
        type: 'color',
        value: '#000000',
      },
      borderRadius: {
        group: 'Borders',
        label: 'Border Radius',
        type: 'number',
        value: 8,
      },
      titleFontSize: {
        group: 'Titles',
        label: 'Font Size',
        type: 'number',
        value: 28,
      },
      titleFontColor: {
        group: 'Titles',
        label: 'Text Color',
        type: 'color',
        value: '#000000',
      },
      titlePadding: {
        group: 'Titles',
        label: 'Title Padding',
        type: 'number',
        value: 4,
      },
      titleBackgroundColor: {
        group: 'Titles',
        label: 'Title BG Color',
        type: 'color',
        value: '#dddddd',
      },
      fontFamily: {
        group: 'Titles',
        label: 'Font Family',
        type: 'select',
        options: {
          Roboto: 'RobotoRegular',
          'Roboto Light': 'RobotoLight',
          'Roboto Bold': 'RobotoBold',
          'Crimson Pro': 'CrimsonPro',
          Lora: 'LoraRegular',
          OpenSans: 'OpenSansRegular',
          'OpenSans Light': 'OpenSansLight',
          'OpenSans Bold': 'OpenSansBold',
          'OpenSansCondensed Light': 'OpenSansCondensedLight',
          'OpenSansCondensed Bold': 'OpenSansCondensedBold',
        },
        value: 'RobotoRegular',
      },
    };
    this.opts = new Options(BaseBlockOptions);

    this.createBaseElements();
  }

  /**
   * Gets inner width of the content section (without block border and block margin)
   * @return {int} width in pixel
   */
  get innerWidth() {
    return (this.width
      - this.opts.get('borderStrokeWidth') * 2
      - this.opts.get('borderMargin') * 2);
  }

  /**
   * Gets inner height of the block's  content section (without title section, block border and block margin).
   * @return {int} height in pixel
   */
  get innerHeight() {
    return (this.height
      - this.opts.get('borderStrokeWidth') * 2
      - this.opts.get('borderMargin') * 2
      - this.titleHeight
    );
  }

  /**
   * Gets height of the block's title section (title text + padding).
   * @return {int} height in pixel
   */
  get titleHeight() {
    const calcHeight = this.opts.get('titleFontSize') + this.opts.get('titlePadding') * 2;
    return (this.opts.get('titleText').length <= 0) ? 0 : calcHeight;
  }

  /**
     * Gets space occupied by the block's border (stroke width + border margin).
     */
  get borderWidth() {
    return this.opts.get('borderStrokeWidth') + this.opts.get('borderMargin');
  }

  /**
   * Gets left offset of the block's content section. Alias to borderWidth().
   * @return {int} x coord of top left
   */
  get xOffset() {
    return this.borderWidth;
  }

  /**
   * Gets top offset of the block's content section
   * @return {int} height in pixel
   */
  get yOffset() {
    let yOffset = this.opts.get('borderStrokeWidth') + this.opts.get('borderMargin');
    if (this.opts.get('titleText').length > 0) {
      yOffset += this.opts.get('titleFontSize') + this.opts.get('titlePadding') * 2;
    }
    return yOffset;
  }

  /**
   * Create blocks root svg element, block border, clip mask and container for title and style.
   */
  createBaseElements() {
    // Block's root container
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // Style container
    this.styleDef = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.append(this.styleDef);
    this.svg.append(defs);

    // Mask to crop off everything outside the border
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    this.maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    mask.appendChild(this.maskRect);
    mask.setAttribute('id', `${this.id}_clip`);
    this.svg.appendChild(mask);

    // Add border
    this.borderRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.svg.appendChild(this.borderRect);

    // Add title container group
    this.titleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.titleGroup.setAttribute('class', 'title-group');
    this.svg.appendChild(this.titleGroup);
  }

  /**
   * Add this block to the paper.
   * @param {SVG} svg Paper's root SVG element
   */
  add(svg) {
    svg.appendChild(this.svg);
    this.render();
  }

  /**
   * Remove this block from the paper.
   */
  remove() {
    const blockSvg = document.getElementById(this.id);
    if (blockSvg) {
      blockSvg.parentNode.removeChild(blockSvg);
    }
  }

  /**
   * Add title text and background to the svg title group
   */
  renderTitle() {
    // Clear existing title
    this.titleGroup.innerHTML = '';

    // Check if title should be drawn at all
    if (this.opts.get('titleText').length <= 0) {
      return;
    }

    // Crop mask
    this.titleGroup.setAttribute('mask', `url(#${this.id}_clip)`);

    // Necessary option values
    const titlePadding = this.opts.get('titlePadding');
    const titleFontSize = this.opts.get('titleFontSize');
    const titleFontColor = this.opts.get('titleFontColor');
    const titleBackgroundColor = this.opts.get('titleBackgroundColor');

    // Background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', this.borderWidth);
    rect.setAttribute('y', this.borderWidth);
    rect.setAttribute('width', this.innerWidth);
    rect.setAttribute('height', this.titleHeight);
    rect.setAttribute('fill', titleBackgroundColor);
    this.titleGroup.append(rect);

    // Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', this.borderWidth + titlePadding);
    text.setAttribute('y', this.borderWidth + this.titleHeight / 2);
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', titleFontColor);
    text.setAttribute('font-size', titleFontSize);
    text.textContent = this.opts.get('titleText');
    this.titleGroup.append(text);
  }

  /**
   * Add css definitions for font.
   * It's necessary to reference the fonts here. It's also important that the font in the reference itself
   * is base64 encoded and embedded in the parent svg (paper). Otherwise, it will not be respected during
   * the conversion to <canvas> (used for preview and png export).
   */
  renderStyleDef() {
    this.styleDef.innerHTML = `
    #${this.id} text {
      font-family: '${this.opts.get('fontFamily')}b64';
    }
    #${this.id} text.icon {
      font-family: 'FontAwesomeb64';
    }`;
  }

  /**
   * Setup size of the block's root svg element.
   */
  renderContainer() {
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
  }

  /**
   * Setup the border style and position.
   */
  renderBorder() {
    const borderMargin = this.opts.get('borderMargin');
    const borderStrokeWidth = this.opts.get('borderStrokeWidth');
    const borderRadius = this.opts.get('borderRadius');
    const borderStrokeColor = this.opts.get('borderStrokeColor');

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

  /**
   * Hook to be overwritten by child class.
   * Get's executed after the rendering/setup of the base elements.
   */
  onRender() {
    return this;
  }

  /**
   * Render the whole block.
   * Called when the block is added to the paper or when options are updated.
   */
  render() {
    this.renderContainer();
    this.renderStyleDef();
    this.renderTitle();
    this.renderBorder();
    this.onRender();
  }
}

export default BaseBlock;
