import BaseBlock from './BaseBlock.js';

class IconBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'IconBlock';
    this.blockOpts.opts.titleText.value = 'Remember to smile!';

    // Extend block specific options
    // (will show up in the left sidebar on block select)
    this.blockOpts.opts = {
      ...this.blockOpts.opts,
      iconCode: {
        group: 'Icon Settings',
        label: 'Icon',
        type: 'select',
        codes: {
          ':-)': '\uf118', // fa-smile-o
          ':-|': '\uf11a', // fa-meh-o
          ':-(': '\uf119', // fa-frown-o
          Apple: '\uf179', // fa-apple
          Beer: '\uf0fc', // fa-beer
          Bug: '\uf188', // fa-bug
          Cirlce: '\uf10c', // fa-thincircle
          Clock: '\uf017', // fa-clock-o
          Code: '\uf121', // fa-code
          Coffee: '\uf0f4', // fa-coffee
          Communicate: '\uf0e6', //  fa-comments-o
          Crosshair: '\uf05b', // fa-crosshair
          Drop: '\uf043', // fa-tint
          Flag: '\uf11d', // fa-flag
          Gift: '\uf06b', // fa-gift
          Hand: '\uf256', // fa-hand-stop-o
          Hear: '\uf08a', // fa-heart-o
          Inbox: '\uf01c', // fa-inbox
          'Hour Glass': '\uf253', // fa-hourglass
          Learn: '\uf19d', // fa-graduation-cap
          Lemon: '\uf094', // fa-lemon-o
          'Ligh Blub': '\uf0eb', // fa-bulb
          Newspaper: '\uf1ea', // fa-newspaper-o
          Paperclip: '\uf0c6', // fa-paperclip
          Phone: '\uf095', // fa-phone
          'Power Off': '\uf011', // fa-power-off
          Rocket: '\uf135', // fa-rocket
          Spinner: '\uf110', // fa-spinner
          Square: '\uf096', // fa-square-o
          Star: '\uf006', // fa-star-o
          'Stand Up': '\uf21d', // fa-street-view
          Stretch: '\uf1ae', // fa-child
          Sun: '\uf185', // fa-sun-o
          'Thumbs Up': '\uf087', // fa-thumbs-o-up
          Envelope: '\uf003', // fa-envelope-o
          Mobile: '\uf10b', // fa-mobile
        },
        value: '\uf118',
      },
      iconColor: {
        group: 'Icon Settings',
        label: 'Icon Color',
        type: 'color',
        value: '#000000',
      },
      iconCount: {
        group: 'Icon Settings',
        label: 'Icon Count',
        type: 'number',
        value: 5,
      },
      iconSize: {
        group: 'Icon Settings',
        label: 'Icon Size',
        type: 'number',
        value: 48,
      },
    };
  }

  clearIcons() {
    const icons = this.svg.querySelectorAll('.icon');
    icons.forEach((icon) => {
      icon.remove();
    });
  }

  renderIcons() {
    const iconSize = this.blockOpts.get('iconSize');
    const iconColor = this.blockOpts.get('iconColor');
    const iconCount = this.blockOpts.get('iconCount');
    const iconCode = this.blockOpts.get('iconCode');

    let iconWidth = 0;
    for (let i = 1; i <= iconCount; i += 1) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'icon');
      text.setAttribute('font-size', iconSize);
      text.setAttribute('fill', iconColor);
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('y', this.innerHeight / 2 + this.yOffset);
      text.setAttribute('font-family', 'FontAwesomeb64');

      text.textContent = iconCode;
      this.svg.appendChild(text);

      iconWidth = Math.max(iconWidth, text.getBBox().width);
      text.setAttribute('x', this.xOffset + (this.innerWidth / (iconCount + 1)) * i);
    }
  }

  onRender() {
    this.clearIcons();
    this.renderIcons();
  }
}

export default IconBlock;
