import BaseBlock from './BaseBlock.js';
import Fonts from '../config.js';

class TextBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Text Block';

    // Append options specific to this block
    const IconBlockOptions = {
      textText: {
        group: 'Block',
        label: 'Text',
        type: 'text',
        value: 'But first, coffee!',
      },
      textColor: {
        group: 'Block',
        label: 'Text Color',
        type: 'color',
        value: '#000000',
      },
      textFontSize: {
        group: 'Block',
        label: 'Font Size',
        type: 'number',
        value: 32,
      },
      textPadding: {
        group: 'Block',
        label: 'Padding',
        type: 'number',
        value: 4,
      },
      textFontFamily: {
        group: 'Block',
        label: 'Font Family',
        type: 'select',
        options: Fonts.getOptions(),
        value: 'RobotoRegular',
      },
      textHorizontalAlign: {
        group: 'Block',
        label: 'Horizontal Align',
        type: 'select',
        options: {
          left: 'start',
          center: 'middle',
          right: 'end',
        },
        value: 'middle',
      },
      textVerticalAlign: {
        group: 'Block',
        label: 'Vertical Align',
        type: 'select',
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom',
        },
        value: 'middle',
      },
    };
    this.opts.add(IconBlockOptions);

    // Reusing title field to store the Text, so lets rename the form label
    this.opts.titleText.value = 'Save the World';

    this.createText();
  }

  createText() {
    this.text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.text.setAttribute('mask', `url(#${this.id}_clip)`);
    this.text.setAttribute('class', 'text-block');
    this.svg.appendChild(this.text);
  }

  /**
   * Add icons to block and style them.
   */
  renderText() {
    const padding = this.opts.get('textPadding');

    // Text content
    this.text.textContent = this.opts.get('textText');

    // Style first
    this.text.setAttribute('font-size', this.opts.get('textFontSize'));
    this.text.setAttribute('fill', this.opts.get('textColor'));

    // Horizontal position
    let x;
    const hAlign = this.opts.get('textHorizontalAlign');
    switch (hAlign) {
      case 'start':
        x = this.xOffset + padding;
        break;
      case 'middle':
        x = this.xOffset + this.innerWidth / 2;
        break;
      default:
        x = this.xOffset + this.innerWidth - padding;
    }
    this.text.setAttribute('x', x);
    this.text.setAttribute('text-anchor', hAlign);

    // vertical position
    let y;
    switch (this.opts.get('textVerticalAlign')) {
      case 'top':
        y = this.yOffset + padding;
        this.text.setAttribute('dominant-baseline', 'hanging');
        break;
      case 'middle':
        y = this.yOffset + this.innerHeight / 2;
        this.text.setAttribute('dominant-baseline', 'middle');
        break;
      default:
        y = this.height - this.borderWidth - padding;
        this.text.setAttribute('dominant-baseline', 'auto');
    }
    this.text.setAttribute('y', y);
  }

  /**
   * Add css definitions for font.
   * It's necessary to reference the fonts here. It's also important that the font in the reference itself
   * is base64 encoded and embedded in the parent svg (paper). Otherwise, it will not be respected during
   * the conversion to <canvas> (used for preview and png export).
   */
  renderStyleDef() {
    this.styleDef.innerHTML = `
      #${this.id} text.text-block  {
        font-family: '${this.opts.get('textFontFamily')}b64';
      }`;
  }

  /**
   * Overwrite default render to skip painting title
   */
  onRender() {
    this.renderText();
  }
}

export default TextBlock;
