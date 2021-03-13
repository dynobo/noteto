import BaseBlock from './BaseBlock.js';

class IconBlock extends BaseBlock {
  constructor(grid, globalOptions) {
    super(grid, globalOptions);
    this.type = 'Icon Block';

    // Append options specific to this block
    const IconBlockOptions = {
      iconCount: {
        group: 'Block',
        label: 'Icon Count',
        type: 'number',
        value: 5,
      },
      iconCode: {
        group: 'Block',
        label: 'Icon',
        type: 'select',
        options: {
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
          Heart: '\uf08a', // fa-heart-o
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
        group: 'Icons',
        label: 'Icon Color',
        type: 'color',
        value: '#000000',
      },
      iconSize: {
        group: 'Icons',
        label: 'Icon Size',
        type: 'number',
        value: 48,
      },
    };
    this.opts.add(IconBlockOptions);

    // Set values inherited by parent block class
    this.opts.titleText.value = 'Remember to smile!';
  }

  /**
   * Delete all icons from block.
   */
  clearIcons() {
    const icons = this.root.querySelectorAll('.icon');
    icons.forEach((icon) => {
      icon.remove();
    });
  }

  /**
   * Add icons to block and style them.
   */
  renderIcons() {
    const iconSize = this.opts.get('iconSize');
    const iconColor = this.opts.get('iconColor');
    const iconCount = this.opts.get('iconCount');
    const iconCode = this.opts.get('iconCode');

    let iconWidth;
    for (let i = 0; i < iconCount; i += 1) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'icon');
      text.setAttribute('font-size', iconSize);
      text.setAttribute('fill', iconColor);
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('y', this.innerHeight / 2 + this.yContentOffset);
      text.setAttribute('font-family', 'FontAwesomeb64');
      text.setAttribute('mask', `url(#${this.id}_clip)`);

      // Add icon to block's svg to be able to calculate its dimensions
      text.textContent = iconCode;
      this.root.appendChild(text);

      // Retrieve width of icon and adjust x position it accordingly
      iconWidth = iconWidth || text.getBBox().width;
      const iconDistance = (this.innerWidth - iconCount * iconWidth) / (iconCount + 1);
      const posX = iconDistance + iconWidth / 2 + (iconDistance + iconWidth) * i;
      text.setAttribute('x', this.xOffset + posX);
    }
  }

  /**
   * Hook that gets execute after rendering of the parents class elements
   */
  onRender() {
    this.clearIcons();
    this.renderIcons();
  }
}

export default IconBlock;
