import Options from './Options.js';
import NewOptions from './NewOptions.js';

class BaseBlock {
  constructor(grid, globalOptions) {
    // Unique ID to identify an individual block instance
    this.id = `id_${Math.random().toString(16).slice(2)}`;

    // Unique type to identify it in the library. This has to be added to config.js:blockTypes
    this.type = 'Base Block';

    // Position information. Handled by interact.js. Don't change manually.
    this.width = grid.x * 3;
    this.height = grid.y * 3;
    this.x = grid.padding;
    this.y = grid.padding;
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
        value: 'Scribble',
      },
    }, this.id);

    const BaseBlockOptions = {
      useGlobal: {
        group: 'Base',
        label: 'Use global settings',
        type: 'checkbox',
        value: true,
      },
      titleText: {
        group: 'Base',
        label: 'Title',
        type: 'text',
        value: 'Scribble',
      },
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
    this.opts = new NewOptions(BaseBlockOptions);

    this.createBaseElements();
  }

  /**
   * Gets inner width of the content section (without block border and block margin)
   * @return {int} width in pixel
   */
  get innerWidth() {
    return (this.width
      - this.globalOpts.get('borderStrokeWidth') * 2
      - this.globalOpts.get('borderMargin') * 2);
  }

  /**
   * Gets inner height of the block's  content section (without title section, block border and block margin).
   * @return {int} height in pixel
   */
  get innerHeight() {
    return (this.height
      - this.globalOpts.get('borderStrokeWidth') * 2
      - this.globalOpts.get('borderMargin') * 2
      - this.titleHeight);
  }

  /**
   * Gets height of the block's title section (title text + padding).
   * @return {int} height in pixel
   */
  get titleHeight() {
    const calcHeight = this.globalOpts.get('titleFontSize') + this.globalOpts.get('titlePadding') * 2;
    return (this.blockOpts.get('titleText').length <= 0) ? 0 : calcHeight;
  }

  /**
     * Gets space occupied by the block's border (stroke width + border margin).
     */
  get borderWidth() {
    return this.globalOpts.get('borderStrokeWidth') + this.globalOpts.get('borderMargin');
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
    let yOffset = this.globalOpts.get('borderStrokeWidth') + this.globalOpts.get('borderMargin');
    if (this.blockOpts.get('titleText').length > 0) {
      yOffset += this.globalOpts.get('titleFontSize') + this.globalOpts.get('titlePadding') * 2;
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
    if (this.blockOpts.get('titleText').length <= 0) {
      return;
    }

    // Crop mask
    this.titleGroup.setAttribute('mask', `url(#${this.id}_clip)`);

    // Necessary option values
    const titlePadding = this.globalOpts.get('titlePadding');
    const titleFontSize = this.globalOpts.get('titleFontSize');
    const titleFontColor = this.globalOpts.get('titleFontColor');
    const titleBackgroundColor = this.globalOpts.get('titleBackgroundColor');

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
    text.textContent = this.blockOpts.get('titleText');
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
      font-family: '${this.globalOpts.get('fontFamily')}b64';
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
    const borderMargin = this.globalOpts.get('borderMargin');
    const borderStrokeWidth = this.globalOpts.get('borderStrokeWidth');
    const borderRadius = this.globalOpts.get('borderRadius');
    const borderStrokeColor = this.globalOpts.get('borderStrokeColor');

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
    console.log(this.type);
    console.log(this.opts);
  }
}

export default BaseBlock;
